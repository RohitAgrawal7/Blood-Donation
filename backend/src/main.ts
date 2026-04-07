import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Enable CORS for development so the frontend (vite) can call the API on a different port
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT || 3001);
  console.log(`Backend listening on http://localhost:${process.env.PORT || 3001}/api`);
}
bootstrap();
