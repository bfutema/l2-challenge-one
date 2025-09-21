import { Test, TestingModule } from '@nestjs/testing';

import { PedidosRequestDto, PedidosResponseDto } from '../dto/packaging.dto';
import { PackagingService } from '../services/packaging.service';

import { PackagingController } from './packaging.controller';

describe('PackagingController', () => {
  let controller: PackagingController;
  let service: PackagingService;

  const mockPackagingService = {
    processarPedidos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagingController],
      providers: [
        {
          provide: PackagingService,
          useValue: mockPackagingService,
        },
      ],
    }).compile();

    controller = module.get<PackagingController>(PackagingController);
    service = module.get<PackagingService>(PackagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedResponse: PedidosResponseDto = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['PS5'],
              },
            ],
          },
        ],
      };

      mockPackagingService.processarPedidos.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processarPedidos(pedidosRequest);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(service.processarPedidos).toHaveBeenCalledWith(pedidosRequest);
      expect(service.processarPedidos).toHaveBeenCalledTimes(1);
    });

    it('should handle empty orders list', async () => {
      // Arrange
      const pedidosRequest: PedidosRequestDto = {
        pedidos: [],
      };

      const expectedResponse: PedidosResponseDto = {
        pedidos: [],
      };

      mockPackagingService.processarPedidos.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processarPedidos(pedidosRequest);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(service.processarPedidos).toHaveBeenCalledWith(pedidosRequest);
    });

    it('should handle multiple orders', async () => {
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
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: 'Joystick',
                dimensoes: { altura: 15, largura: 20, comprimento: 10 },
              },
            ],
          },
        ],
      };

      const expectedResponse: PedidosResponseDto = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['PS5'],
              },
            ],
          },
          {
            pedido_id: 2,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['Joystick'],
              },
            ],
          },
        ],
      };

      mockPackagingService.processarPedidos.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processarPedidos(pedidosRequest);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.pedidos).toHaveLength(2);
      expect(service.processarPedidos).toHaveBeenCalledWith(pedidosRequest);
    });

    it('should handle service errors', async () => {
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

      const error = new Error('Database connection failed');
      mockPackagingService.processarPedidos.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.processarPedidos(pedidosRequest)).rejects.toThrow(
        'Database connection failed',
      );
      expect(service.processarPedidos).toHaveBeenCalledWith(pedidosRequest);
    });
  });
});
