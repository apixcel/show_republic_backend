import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { ProfileService } from './services/profileService';

@Module({
  imports: [DatabaseModule, MikroOrmModule.forFeature([UserEntity], 'postgres')],
  controllers: [AppController],
  providers: [ProfileService],
})
export class AppModule {}
