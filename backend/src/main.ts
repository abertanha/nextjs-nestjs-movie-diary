import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';

async function bootstrap() {
  const databaseFile = 'db.sqlite';
  if (existsSync(databaseFile)) {
    unlinkSync(databaseFile);
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // CORS PARA AMBIENTE DEV
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend rodando na porta ${await app.getUrl()}`);
}
bootstrap();
