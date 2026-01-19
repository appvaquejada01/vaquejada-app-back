if (!(global as any).crypto) {
  (global as any).crypto = require('crypto');
}

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { appConfig } from './config/env';
import { apiRateLimiter } from './utils/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:8080', // desenvolvimento local
      'https://vaquejada-app.onrender.com', // domínio do backend
      'https://vaquejada-app.netlify.app', // (opcional) domínio futuro do front
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Body parsers
  app.use('/webhooks/mp', bodyParser.raw({ type: '*/*' }));
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

  // Rate limiter
  app.use(apiRateLimiter);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Vaquejada API')
    .setDescription('Documentação das rotas da API Vaquejada')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port);
  console.log(`🚀 API Vaquejada rodando na porta ${appConfig.port}`);
}
bootstrap();
