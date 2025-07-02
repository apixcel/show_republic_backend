import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@show-republic/config';
import { AdminEntity, CreatorEntity, PostEntity, UserEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { StatisticsService } from './services/statistics.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forFeature([AdminEntity, PostEntity], 'mongo'),
    MikroOrmModule.forFeature([CreatorEntity, UserEntity], 'postgres'),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AppController],
  providers: [StatisticsService],
})
export class AppModule {}
