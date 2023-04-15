import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { registerSwagger } from './app/app.swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  registerSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap().catch(console.error);
