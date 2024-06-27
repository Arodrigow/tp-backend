import { loadConfig } from './shared/utils/config';
loadConfig();

import { NestFactory } from '@nestjs/core';
import helmet from '@fastify/helmet'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(helmet);
  app.enableCors(
    {
      origin: '*',
      methods: 'GET,POST,OPTIONS',
      allowedHeaders: 'Origin, Content-Type, Accept, Authorization',
    }
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
