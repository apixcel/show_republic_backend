import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StatisticsService } from './services/statistics.service';

@Controller()
export class AppController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern({ cmd: 'sample_test' })
  test(): string {
    return this.statisticsService.adminStatistics();
  }
}
