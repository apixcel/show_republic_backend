import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { CreatorEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { CreatorService } from './services/creator.service';
import { CreatorChannelService } from './services/creatorChannel.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([CreatorEntity], 'postgres'), // Use 'mongo' context here
  ],
  controllers: [AppController],
  providers: [CreatorService, CreatorChannelService],
})
export class AppModule {}
