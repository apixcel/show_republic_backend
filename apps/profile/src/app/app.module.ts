import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { PlaylistService } from './services/playlist.service';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [DatabaseModule, MikroOrmModule.forFeature([UserEntity], 'postgres')],
  controllers: [AppController],
  providers: [ProfileService, PlaylistService],
})
export class AppModule {}
