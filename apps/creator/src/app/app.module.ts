
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CreatorService } from './services/creator.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CreatorService],
})
export class AppModule {}


