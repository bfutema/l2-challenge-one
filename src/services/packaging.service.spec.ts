import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PackagingService } from './packaging.service';
import { Caixa } from '../entities/caixa.entity';
import { Produto } from '../entities/produto.entity';
import { Pedido } from '../entities/pedido.entity';
import { PedidoCaixa } from '../entities/pedido-caixa.entity';
import { PedidosRequestDto } from '../dto/packaging.dto';

describe('PackagingService', () => {
  let service: PackagingService;

  const mockCaixaRepository = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockProdutoRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockPedidoRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockPedidoCaixaRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagingService,
        {
          provide: getRepositoryToken(Caixa),
          useValue: mockCaixaRepository,
        },
        {
          provide: getRepositoryToken(Produto),
          useValue: mockProdutoRepository,
        },
        {
          provide: getRepositoryToken(Pedido),
          useValue: mockPedidoRepository,
        },
        {
          provide: getRepositoryToken(PedidoCaixa),
          useValue: mockPedidoCaixaRepository,
        },
      ],
    }).compile();

    service = module.get<PackagingService>(PackagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processarPedidos', () => {
    it('should process orders and return packaging results', async () => {
      // Arrange
      const pedidosRequest: PedidosRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: { altura: 40, largura: 10, comprimento: 25 },
              },
            ],
          },
        ],
      };

      mockCaixaRepository.count.mockResolvedValue(0);
      mockCaixaRepository.create.mockReturnValue({ id: 1, nome: 'Caixa 1' });
      mockCaixaRepository.save.mockResolvedValue({ id: 1, nome: 'Caixa 1' });
      mockPedidoRepository.create.mockReturnValue({ id: 1, pedido_id: 1 });
      mockPedidoRepository.save.mockResolvedValue({ id: 1, pedido_id: 1 });
      mockProdutoRepository.create.mockReturnValue({
        id: 1,
        produto_id: 'PS5',
      });
      mockProdutoRepository.save.mockResolvedValue({
        id: 1,
        produto_id: 'PS5',
      });
      mockPedidoCaixaRepository.create.mockReturnValue({ id: 1 });
      mockPedidoCaixaRepository.save.mockResolvedValue({ id: 1 });
      mockCaixaRepository.findOne.mockResolvedValue({ id: 1, nome: 'Caixa 1' });

      // Act
      const result = await service.processarPedidos(pedidosRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[0].caixas).toBeDefined();
      expect(mockCaixaRepository.count).toHaveBeenCalled();
      expect(mockPedidoRepository.create).toHaveBeenCalled();
      expect(mockPedidoRepository.save).toHaveBeenCalled();
    });

    it('should handle products that do not fit in any box', async () => {
      // Arrange
      const pedidosRequest: PedidosRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'Cadeira Gamer',
                dimensoes: { altura: 120, largura: 60, comprimento: 70 },
              },
            ],
          },
        ],
      };

      mockCaixaRepository.count.mockResolvedValue(0);
      mockCaixaRepository.create.mockReturnValue({ id: 1, nome: 'Caixa 1' });
      mockCaixaRepository.save.mockResolvedValue({ id: 1, nome: 'Caixa 1' });
      mockPedidoRepository.create.mockReturnValue({ id: 1, pedido_id: 1 });
      mockPedidoRepository.save.mockResolvedValue({ id: 1, pedido_id: 1 });
      mockProdutoRepository.create.mockReturnValue({
        id: 1,
        produto_id: 'Cadeira Gamer',
      });
      mockProdutoRepository.save.mockResolvedValue({
        id: 1,
        produto_id: 'Cadeira Gamer',
      });
      mockPedidoCaixaRepository.create.mockReturnValue({ id: 1 });
      mockPedidoCaixaRepository.save.mockResolvedValue({ id: 1 });

      // Act
      const result = await service.processarPedidos(pedidosRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.pedidos[0].caixas[0].caixa_id).toBeNull();
      expect(result.pedidos[0].caixas[0].observacao).toContain(
        'não cabe em nenhuma caixa',
      );
    });

    it('should handle multiple products in one order', async () => {
      // Arrange
      const pedidosRequest: PedidosRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'Joystick',
                dimensoes: { altura: 15, largura: 20, comprimento: 10 },
              },
              {
                produto_id: 'Fifa 24',
                dimensoes: { altura: 10, largura: 30, comprimento: 10 },
              },
            ],
          },
        ],
      };

      mockCaixaRepository.count.mockResolvedValue(0);
      mockCaixaRepository.create.mockReturnValue({ id: 1, nome: 'Caixa 1' });
      mockCaixaRepository.save.mockResolvedValue({ id: 1, nome: 'Caixa 1' });
      mockPedidoRepository.create.mockReturnValue({ id: 1, pedido_id: 1 });
      mockPedidoRepository.save.mockResolvedValue({ id: 1, pedido_id: 1 });
      mockProdutoRepository.create.mockReturnValue({
        id: 1,
        produto_id: 'Joystick',
      });
      mockProdutoRepository.save.mockResolvedValue({
        id: 1,
        produto_id: 'Joystick',
      });
      mockPedidoCaixaRepository.create.mockReturnValue({ id: 1 });
      mockPedidoCaixaRepository.save.mockResolvedValue({ id: 1 });
      mockCaixaRepository.findOne.mockResolvedValue({ id: 1, nome: 'Caixa 1' });

      // Act
      const result = await service.processarPedidos(pedidosRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.pedidos[0].caixas[0].produtos).toHaveLength(2);
      expect(result.pedidos[0].caixas[0].produtos).toContain('Joystick');
      expect(result.pedidos[0].caixas[0].produtos).toContain('Fifa 24');
    });
  });

  describe('inicializarCaixas', () => {
    it('should initialize boxes when none exist', async () => {
      // Arrange
      mockCaixaRepository.count.mockResolvedValue(0);
      mockCaixaRepository.create.mockReturnValue({ id: 1, nome: 'Caixa 1' });
      mockCaixaRepository.save.mockResolvedValue({ id: 1, nome: 'Caixa 1' });

      // Act
      await service['inicializarCaixas']();

      // Assert
      expect(mockCaixaRepository.count).toHaveBeenCalled();
      expect(mockCaixaRepository.create).toHaveBeenCalledTimes(3);
      expect(mockCaixaRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should not initialize boxes when they already exist', async () => {
      // Arrange
      mockCaixaRepository.count.mockResolvedValue(3);

      // Act
      await service['inicializarCaixas']();

      // Assert
      expect(mockCaixaRepository.count).toHaveBeenCalled();
      expect(mockCaixaRepository.create).not.toHaveBeenCalled();
      expect(mockCaixaRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('calcularVolume', () => {
    it('should calculate volume correctly', () => {
      // Arrange
      const dimensoes = { altura: 10, largura: 20, comprimento: 30 };

      // Act
      const volume = service['calcularVolume'](dimensoes);

      // Assert
      expect(volume).toBe(6000);
    });
  });
});
