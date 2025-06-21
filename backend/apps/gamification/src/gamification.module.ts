import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';

@Module({
  imports: [],
  controllers: [GamificationController],
  providers: [GamificationService],
})
export class GamificationModule {}
