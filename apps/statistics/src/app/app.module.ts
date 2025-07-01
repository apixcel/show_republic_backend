
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StatisticsService } from './services/statistics.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [StatisticsService],
})
export class AppModule {}


