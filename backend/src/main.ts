import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  // Настройка для раздачи статических файлов
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  await app.listen(5000);
  console.log('Server is running on http://localhost:5000');
}
bootstrap();