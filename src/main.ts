import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as config from 'config';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  await app.listen(config.get('port'));
}
bootstrap();
