import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './app/authentication.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
      },
    },
  );

  await app.listen();
  Logger.log(`🚀 Authentication Service is running....`);
}

bootstrap();
