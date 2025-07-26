import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { SetCookieUtilService } from '@show-republic/utils';
import { AdminController } from './controllers/admin.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { BrandController } from './controllers/brand.controller';
import { CreatorController } from './controllers/creator.controller';
import { GameficationController } from './controllers/gamefication.controller';
import { LiveController } from './controllers/live.controller';
import { NotificationController } from './controllers/notification.controller';
import { PostController } from './controllers/post.controller';
import { ProfileController } from './controllers/profile.controller';
import { StatisticsController } from './controllers/statistics.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { NatsClientModule } from './nats-client.module';

@Module({
  imports: [
    ConfigModule,
    NatsClientModule,
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    AuthenticationController,
    PostController,
    GameficationController,
    CreatorController,
    AdminController,
    StatisticsController,
    SubscriptionController,
    LiveController,
    BrandController,
    ProfileController,
    NotificationController,
  ],
  providers: [JWTSTRATEGY,  SetCookieUtilService],
  // providers: [],
})
export class AppModule {}
