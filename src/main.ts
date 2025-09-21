/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('🔧 Configurando Swagger...');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Embalagem - Seu Manoel')
    .setDescription(
      'API para automatizar o processo de embalagem de pedidos da loja de jogos online',
    )
    .setVersion('1.0')
    .addTag('packaging', 'Endpoints para processamento de embalagem')
    .build();

  console.log('📝 Criando documento Swagger...');
  const document = SwaggerModule.createDocument(app, config);

  console.log('🚀 Configurando rota /api...');
  SwaggerModule.setup('api', app, document);

  console.log('✅ Swagger configurado com sucesso!');

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 API rodando em: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger disponível em: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

bootstrap();
