import { Controller, Get } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller()
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get()
  getHello(): string {
    return this.gamificationService.getHello();
  }
}
