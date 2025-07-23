import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { CreatorEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { CreatorService } from './services/creator.service';
import { CreatorAnalyticsService } from './services/creatorAnalytics.service';
import { CreatorChannelService } from './services/creatorChannel.service';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([CreatorEntity], 'postgres'), // Use 'mongo' context here
  ],
  controllers: [AppController],
  providers: [CreatorService, CreatorChannelService, SubscriptionService, CreatorAnalyticsService],
})
export class AppModule {}
