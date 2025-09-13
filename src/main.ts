import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appConfig.port);
  console.log(`🚀 API Vaquejada rodando na porta ${appConfig.port}`);
}
bootstrap();
