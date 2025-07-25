import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('statistics')
export class StatisticsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get('/admin')
  async adminStatistics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'statistics_admin' }, {}));
    return order;
  }
  @Get('/user')
  async userStatistics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'statistics_user' }, {}));
    return order;
  }
  @Get('/user-age-group')
  async ageGroupStatistics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'statistics_user_age_group' }, {}));
    return order;
  }
  @Get('/user-gender-group')
  async genderStatistics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'statistics_user_gender_group' }, {}));
    return order;
  }
  @Get('/user-account-group')
  async accountTypeStatistics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'statistics_user_account_group' }, {}));
    return order;
  }
  @Get('/gamefication')
  async gameficatoinStatistics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'statistics_gamificatoin' }, {}));
    return order;
  }
  @Get('/analytics/country-based')
  async countryBasedAnalytics() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'analytics_country_based' }, {}));
    return order;
  }
  @Get('/analytics/country-based/:country')
  async getUsersByCountry(@Param('country') countryName: string) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'analytics_country_based_user' }, countryName));
    return order;
  }
}
