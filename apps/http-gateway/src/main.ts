import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@show-republic/config';
import { CustomValidationPipe, HttpExceptionFilter, TransformInterceptor } from '@show-republic/validators';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3003'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new CustomValidationPipe());

  // Add the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const configService = app.get(ConfigService);
  // const configService = { port: 3000 };
  const port = configService.port || 3000;
  console.log('Using port:', port);

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Http Gateway is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
