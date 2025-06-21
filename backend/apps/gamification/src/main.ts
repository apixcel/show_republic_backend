import { NestFactory } from '@nestjs/core';
import { GamificationModule } from './gamification.module';

async function bootstrap() {
  const app = await NestFactory.create(GamificationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
