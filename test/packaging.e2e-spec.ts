import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';

describe('PackagingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('/packaging/process (POST)', () => {
    it('should process a single order successfully', () => {
      const pedidosRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: {
                  altura: 40,
                  largura: 10,
                  comprimento: 25,
                },
              },
            ],
          },
        ],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(pedidosRequest)
        .expect(201)
        .expect((res) => {
          const body = res.body as {
            pedidos: { pedido_id: number; caixas: { produtos: string[] }[] }[];
          };
          expect(body).toBeDefined();
          expect(body.pedidos).toHaveLength(1);
          expect(body.pedidos[0].pedido_id).toBe(1);
          expect(body.pedidos[0].caixas).toBeDefined();
          expect(body.pedidos[0].caixas[0].produtos).toContain('PS5');
        });
    });

    it('should handle products that do not fit in any box', () => {
      const pedidosRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'Cadeira Gamer',
                dimensoes: {
                  altura: 120,
                  largura: 60,
                  comprimento: 70,
                },
              },
            ],
          },
        ],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(pedidosRequest)
        .expect(201)
        .expect((res) => {
          const body = res.body as {
            pedidos: { caixas: { caixa_id: number; observacao: string }[] }[];
          };
          expect(body).toBeDefined();
          expect(body.pedidos[0].caixas[0].caixa_id).toBeNull();
          expect(body.pedidos[0].caixas[0].observacao).toContain(
            'não cabe em nenhuma caixa',
          );
        });
    });

    it('should handle multiple products in one order', () => {
      const pedidosRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'Joystick',
                dimensoes: {
                  altura: 15,
                  largura: 20,
                  comprimento: 10,
                },
              },
              {
                produto_id: 'Fifa 24',
                dimensoes: {
                  altura: 10,
                  largura: 30,
                  comprimento: 10,
                },
              },
            ],
          },
        ],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(pedidosRequest)
        .expect(201)
        .expect((res) => {
          const body = res.body as {
            pedidos: { caixas: { produtos: string[] }[] }[];
          };
          expect(body).toBeDefined();
          expect(body.pedidos[0].caixas[0].produtos).toHaveLength(2);
          expect(body.pedidos[0].caixas[0].produtos).toContain('Joystick');
          expect(body.pedidos[0].caixas[0].produtos).toContain('Fifa 24');
        });
    });

    it('should handle multiple orders', () => {
      const pedidosRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: {
                  altura: 40,
                  largura: 10,
                  comprimento: 25,
                },
              },
            ],
          },
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: 'Joystick',
                dimensoes: {
                  altura: 15,
                  largura: 20,
                  comprimento: 10,
                },
              },
            ],
          },
        ],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(pedidosRequest)
        .expect(201)
        .expect((res) => {
          const body = res.body as {
            pedidos: { pedido_id: number }[];
          };
          expect(body).toBeDefined();
          expect(body.pedidos).toHaveLength(2);
          expect(body.pedidos[0].pedido_id).toBe(1);
          expect(body.pedidos[1].pedido_id).toBe(2);
        });
    });

    it('should handle empty orders list', () => {
      const pedidosRequest = {
        pedidos: [],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(pedidosRequest)
        .expect(201)
        .expect((res) => {
          const body = res.body as { pedidos: { pedido_id: number }[] };
          expect(res.body).toBeDefined();
          expect(body.pedidos).toHaveLength(0);
        });
    });

    it('should return 500 for invalid request body', () => {
      const invalidRequest = {
        invalid: 'data',
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(invalidRequest)
        .expect(500);
    });

    it('should return 500 for missing required fields', () => {
      const invalidRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                // Missing dimensoes
              },
            ],
          },
        ],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(invalidRequest)
        .expect(500);
    });

    it('should handle complex order with multiple products and boxes', () => {
      const pedidosRequest = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'Webcam',
                dimensoes: {
                  altura: 7,
                  largura: 10,
                  comprimento: 5,
                },
              },
              {
                produto_id: 'Microfone',
                dimensoes: {
                  altura: 25,
                  largura: 10,
                  comprimento: 10,
                },
              },
              {
                produto_id: 'Monitor',
                dimensoes: {
                  altura: 50,
                  largura: 60,
                  comprimento: 20,
                },
              },
              {
                produto_id: 'Notebook',
                dimensoes: {
                  altura: 2,
                  largura: 35,
                  comprimento: 25,
                },
              },
            ],
          },
        ],
      };

      return request(app.getHttpServer() as App)
        .post('/packaging/process')
        .send(pedidosRequest)
        .expect(201)
        .expect((res) => {
          const body = res.body as {
            pedidos: { caixas: { produtos: string[] }[] }[];
          };
          expect(body).toBeDefined();
          expect(body.pedidos[0].caixas).toBeDefined();
          expect(body.pedidos[0].caixas.length).toBeGreaterThan(0);

          const allProducts: string[] = body.pedidos[0].caixas.flatMap(
            (caixa: { produtos: string[] }) => caixa.produtos,
          );
          expect(allProducts).toContain('Webcam');
          expect(allProducts).toContain('Microfone');
          expect(allProducts).toContain('Monitor');
          expect(allProducts).toContain('Notebook');
        });
    });
  });
});
