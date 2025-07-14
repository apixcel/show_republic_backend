import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { PlaylistEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { PlaylistService } from './services/playlist.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([PlaylistEntity], 'mongo'), // Use 'mongo' context here
  ],
  controllers: [AppController],
  providers: [PlaylistService],
})
export class AppModule {}
