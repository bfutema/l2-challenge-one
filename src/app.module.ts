import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PackagingController } from './controllers/packaging.controller';
import { PackagingService } from './services/packaging.service';
import { Caixa } from './entities/caixa.entity';
import { Produto } from './entities/produto.entity';
import { Pedido } from './entities/pedido.entity';
import { PedidoCaixa } from './entities/pedido-caixa.entity';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      username: envConfig.DB_USERNAME,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      entities: [Caixa, Produto, Pedido, PedidoCaixa],
      synchronize: true, // Habilitar para criar tabelas automaticamente
      logging: envConfig.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Caixa, Produto, Pedido, PedidoCaixa]),
  ],
  controllers: [AppController, PackagingController],
  providers: [AppService, PackagingService],
})
export class AppModule {}
