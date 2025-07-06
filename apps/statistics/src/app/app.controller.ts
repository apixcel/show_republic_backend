import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StatisticsService } from './services/statistics.service';

@Controller()
export class AppController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern({ cmd: 'statistics_admin' })
  adminStatistics() {
    return this.statisticsService.adminStatistics();
  }
  @MessagePattern({ cmd: 'statistics_user' })
  userStatistics() {
    return this.statisticsService.userStatistics();
  }
  @MessagePattern({ cmd: 'statistics_user_age_group' })
  ageGroupStatistics() {
    return this.statisticsService.ageGroupStatistics();
  }
  @MessagePattern({ cmd: 'statistics_user_gender_group' })
  genderStatistics() {
    return this.statisticsService.genderStatistics();
  }
  @MessagePattern({ cmd: 'statistics_user_account_group' })
  accountTypeStatistics() {
    return this.statisticsService.accountTypeStatistics();
  }
  @MessagePattern({ cmd: 'statistics_gamificatoin' })
  gameficatoinStatistics() {
    return this.statisticsService.gameficatoinStatistics();
  }
  @MessagePattern({ cmd: 'analytics_country_based' })
  countryBasedAnalytics() {
    return this.statisticsService.countryBasedAnalytics();
  }
  @MessagePattern({ cmd: 'analytics_country_based_user' })
  getUsersByCountry(countryName: string) {
    return this.statisticsService.getUsersByCountry(countryName);
  }
}
