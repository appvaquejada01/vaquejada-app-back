if (!(global as any).crypto) {
  (global as any).crypto = require('crypto');
}
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { appConfig } from './config/env';
import { apiRateLimiter } from './utils/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(apiRateLimiter);

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
