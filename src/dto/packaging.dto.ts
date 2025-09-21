import { ApiProperty } from '@nestjs/swagger';

export class DimensoesDto {
  @ApiProperty({
    description: 'Altura do produto em centímetros',
    example: 40,
  })
  altura: number;

  @ApiProperty({
    description: 'Largura do produto em centímetros',
    example: 10,
  })
  largura: number;

  @ApiProperty({
    description: 'Comprimento do produto em centímetros',
    example: 25,
  })
  comprimento: number;
}

export class ProdutoDto {
  @ApiProperty({
    description: 'Identificador único do produto',
    example: 'PS5',
  })
  produto_id: string;

  @ApiProperty({
    description: 'Dimensões do produto',
    type: DimensoesDto,
  })
  dimensoes: DimensoesDto;
}

export class PedidoDto {
  @ApiProperty({
    description: 'Identificador único do pedido',
    example: 1,
  })
  pedido_id: number;

  @ApiProperty({
    description: 'Lista de produtos do pedido',
    type: [ProdutoDto],
  })
  produtos: ProdutoDto[];
}

export class PedidosRequestDto {
  @ApiProperty({
    description: 'Lista de pedidos para processar',
    type: [PedidoDto],
  })
  pedidos: PedidoDto[];
}

export class CaixaResponseDto {
  @ApiProperty({
    description: 'Identificador da caixa usada (null se não couber)',
    example: 'Caixa 1',
    nullable: true,
  })
  caixa_id: string | null;

  @ApiProperty({
    description: 'Lista de produtos colocados nesta caixa',
    example: ['PS5', 'Volante'],
  })
  produtos: string[];

  @ApiProperty({
    description: 'Observação sobre a embalagem',
    example: 'Produto não cabe em nenhuma caixa disponível.',
    required: false,
  })
  observacao?: string;
}

export class PedidoResponseDto {
  @ApiProperty({
    description: 'Identificador único do pedido',
    example: 1,
  })
  pedido_id: number;

  @ApiProperty({
    description: 'Lista de caixas usadas para o pedido',
    type: [CaixaResponseDto],
  })
  caixas: CaixaResponseDto[];
}

export class PedidosResponseDto {
  @ApiProperty({
    description: 'Lista de pedidos processados',
    type: [PedidoResponseDto],
  })
  pedidos: PedidoResponseDto[];
}
