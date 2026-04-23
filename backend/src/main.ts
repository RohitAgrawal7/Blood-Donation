import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';

async function bootstrap() {   // ✅ 'async' not 'sync'
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  
  const PORT = process.env.PORT || 3001;
  
  // ✅ CRITICAL: Listen on '0.0.0.0' and the correct port
  await app.listen(PORT, '0.0.0.0');
  
  // ✅ Log the actual binding (Railway will show the public URL separately)
  console.log(`Backend server running on 0.0.0.0:${PORT}`);
}
bootstrap();