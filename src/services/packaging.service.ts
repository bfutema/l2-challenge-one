import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PedidosRequestDto,
  PedidosResponseDto,
  PedidoDto,
  DimensoesDto,
  PedidoResponseDto,
  CaixaResponseDto,
} from '../dto/packaging.dto';
import { Caixa } from '../entities/caixa.entity';
import { Produto } from '../entities/produto.entity';
import { Pedido } from '../entities/pedido.entity';
import { PedidoCaixa } from '../entities/pedido-caixa.entity';

interface CaixaInterface {
  id: string;
  dimensoes: DimensoesDto;
  volume: number;
}

interface ProdutoComDimensoes {
  produto_id: string;
  dimensoes: DimensoesDto;
  volume: number;
}

@Injectable()
export class PackagingService {
  constructor(
    @InjectRepository(Caixa)
    private readonly caixaRepository: Repository<Caixa>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(PedidoCaixa)
    private readonly pedidoCaixaRepository: Repository<PedidoCaixa>,
  ) {}

  private readonly caixas: CaixaInterface[] = [
    {
      id: 'Caixa 1',
      dimensoes: { altura: 30, largura: 40, comprimento: 80 },
      volume: 96000,
    },
    {
      id: 'Caixa 2',
      dimensoes: { altura: 50, largura: 50, comprimento: 40 },
      volume: 100000,
    },
    {
      id: 'Caixa 3',
      dimensoes: { altura: 50, largura: 80, comprimento: 60 },
      volume: 240000,
    },
  ];

  public async processarPedidos(
    pedidosRequest: PedidosRequestDto,
  ): Promise<PedidosResponseDto> {
    const pedidosProcessados: PedidoResponseDto[] = [];

    // Inicializar caixas no banco se não existirem
    await this.inicializarCaixas();

    for (const pedidoDto of pedidosRequest.pedidos) {
      // Salvar pedido no banco
      const pedido = await this.salvarPedido(pedidoDto);

      // Processar embalagem
      const caixasUsadas = this.processarPedido(pedidoDto);

      // Salvar resultado no banco
      await this.salvarResultadoEmbalagem(pedido.id, caixasUsadas);

      pedidosProcessados.push({
        pedido_id: pedidoDto.pedido_id,
        caixas: caixasUsadas,
      });
    }

    return { pedidos: pedidosProcessados };
  }

  private processarPedido(pedido: PedidoDto): CaixaResponseDto[] {
    const produtos = pedido.produtos.map((produto) => ({
      ...produto,
      volume: this.calcularVolume(produto.dimensoes),
    }));

    // Ordenar produtos por volume (maior primeiro) para otimizar o empacotamento
    produtos.sort((a, b) => b.volume - a.volume);

    const caixasUsadas: CaixaResponseDto[] = [];
    const produtosNaoEmpacotados = [...produtos];

    while (produtosNaoEmpacotados.length > 0) {
      const melhorCaixa = this.encontrarMelhorCaixa(produtosNaoEmpacotados);

      if (melhorCaixa) {
        const produtosNaCaixa = this.empacotarProdutosNaCaixa(
          melhorCaixa,
          produtosNaoEmpacotados,
        );

        caixasUsadas.push({
          caixa_id: melhorCaixa.id,
          produtos: produtosNaCaixa.map((p) => p.produto_id),
        });

        // Remover produtos empacotados da lista
        produtosNaCaixa.forEach((produtoEmpacotado) => {
          const index = produtosNaoEmpacotados.findIndex(
            (p) => p.produto_id === produtoEmpacotado.produto_id,
          );
          if (index !== -1) {
            produtosNaoEmpacotados.splice(index, 1);
          }
        });
      } else {
        // Nenhuma caixa pode acomodar os produtos restantes
        const produtosRestantes = produtosNaoEmpacotados.map(
          (p) => p.produto_id,
        );
        caixasUsadas.push({
          caixa_id: null,
          produtos: produtosRestantes,
          observacao: 'Produto não cabe em nenhuma caixa disponível.',
        });
        break;
      }
    }

    return caixasUsadas;
  }

  private encontrarMelhorCaixa(
    produtos: ProdutoComDimensoes[],
  ): CaixaInterface | null {
    let melhorCaixa: CaixaInterface | null = null;
    let melhorEficiencia = 0;

    for (const caixa of this.caixas) {
      if (this.podeAcomodarProdutos(caixa, produtos)) {
        const eficiencia = this.calcularEficiencia(caixa, produtos);
        if (eficiencia > melhorEficiencia) {
          melhorEficiencia = eficiencia;
          melhorCaixa = caixa;
        }
      }
    }

    return melhorCaixa;
  }

  private podeAcomodarProdutos(
    caixa: CaixaInterface,
    produtos: ProdutoComDimensoes[],
  ): boolean {
    // Verificar se pelo menos um produto cabe na caixa
    return produtos.some((produto) => this.produtoCabeNaCaixa(produto, caixa));
  }

  private produtoCabeNaCaixa(
    produto: ProdutoComDimensoes,
    caixa: CaixaInterface,
  ): boolean {
    const { altura, largura, comprimento } = produto.dimensoes;
    const caixaDimensoes = caixa.dimensoes;

    // Verificar todas as rotações possíveis do produto
    const rotacoes = [
      [altura, largura, comprimento],
      [altura, comprimento, largura],
      [largura, altura, comprimento],
      [largura, comprimento, altura],
      [comprimento, altura, largura],
      [comprimento, largura, altura],
    ];

    return rotacoes.some(
      ([h, w, l]) =>
        h <= caixaDimensoes.altura &&
        w <= caixaDimensoes.largura &&
        l <= caixaDimensoes.comprimento,
    );
  }

  private calcularEficiencia(
    caixa: CaixaInterface,
    produtos: ProdutoComDimensoes[],
  ): number {
    // Calcular quantos produtos cabem na caixa e a eficiência do espaço
    const produtosQueCabem = produtos.filter((produto) =>
      this.produtoCabeNaCaixa(produto, caixa),
    );

    if (produtosQueCabem.length === 0) return 0;

    const volumeTotalProdutos = produtosQueCabem.reduce(
      (total, produto) => total + produto.volume,
      0,
    );

    // Eficiência baseada na quantidade de produtos e uso do espaço
    const eficienciaEspaco = volumeTotalProdutos / caixa.volume;
    const eficienciaQuantidade = produtosQueCabem.length / produtos.length;

    return eficienciaEspaco * 0.7 + eficienciaQuantidade * 0.3;
  }

  private empacotarProdutosNaCaixa(
    caixa: CaixaInterface,
    produtos: ProdutoComDimensoes[],
  ): ProdutoComDimensoes[] {
    const produtosNaCaixa: ProdutoComDimensoes[] = [];
    const produtosDisponiveis = [...produtos];

    // Usar algoritmo ganancioso para empacotar o máximo de produtos possível
    while (produtosDisponiveis.length > 0) {
      const produto = produtosDisponiveis.shift();

      if (produto && this.produtoCabeNaCaixa(produto, caixa)) {
        produtosNaCaixa.push(produto);
      }
    }

    return produtosNaCaixa;
  }

  private calcularVolume(dimensoes: DimensoesDto): number {
    return dimensoes.altura * dimensoes.largura * dimensoes.comprimento;
  }

  private async inicializarCaixas(): Promise<void> {
    const caixasExistentes = await this.caixaRepository.count();

    if (caixasExistentes === 0) {
      for (const caixa of this.caixas) {
        const novaCaixa = this.caixaRepository.create({
          nome: caixa.id,
          altura: caixa.dimensoes.altura,
          largura: caixa.dimensoes.largura,
          comprimento: caixa.dimensoes.comprimento,
          volume: caixa.volume,
        });
        await this.caixaRepository.save(novaCaixa);
      }
    }
  }

  private async salvarPedido(pedidoDto: PedidoDto): Promise<Pedido> {
    const pedido = this.pedidoRepository.create({
      pedido_id: pedidoDto.pedido_id,
    });
    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    // Salvar produtos
    for (const produtoDto of pedidoDto.produtos) {
      const produto = this.produtoRepository.create({
        produto_id: produtoDto.produto_id,
        altura: produtoDto.dimensoes.altura,
        largura: produtoDto.dimensoes.largura,
        comprimento: produtoDto.dimensoes.comprimento,
        volume: this.calcularVolume(produtoDto.dimensoes),
        pedido_id: pedidoSalvo.id,
      });
      await this.produtoRepository.save(produto);
    }

    return pedidoSalvo;
  }

  private async salvarResultadoEmbalagem(
    pedidoId: number,
    caixasUsadas: CaixaResponseDto[],
  ): Promise<void> {
    for (const caixaUsada of caixasUsadas) {
      const caixaId = caixaUsada.caixa_id
        ? await this.obterCaixaIdPorNome(caixaUsada.caixa_id)
        : undefined;
      const pedidoCaixa = this.pedidoCaixaRepository.create({
        pedido_id: pedidoId,
        caixa_id: caixaId,
        produtos: caixaUsada.produtos,
        observacao: caixaUsada.observacao,
      });
      await this.pedidoCaixaRepository.save(pedidoCaixa);
    }
  }

  private async obterCaixaIdPorNome(
    nomeCaixa: string,
  ): Promise<number | undefined> {
    const caixa = await this.caixaRepository.findOne({
      where: { nome: nomeCaixa },
    });
    return caixa ? caixa.id : undefined;
  }
}
