
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostCommentService } from './services/PostComment.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PostCommentService],
})
export class AppModule {}


