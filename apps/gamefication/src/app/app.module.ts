import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { ChallengeEntity, PostEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { GameficationService } from './services/gamefication.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([ChallengeEntity], 'mongo'), // Use 'mongo' context here
  ],
  controllers: [AppController],
  providers: [GameficationService],
})
export class AppModule {}
