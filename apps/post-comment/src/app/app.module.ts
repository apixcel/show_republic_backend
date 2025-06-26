import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { PostCommentEntity, PostEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { CreatePostCommentService } from './services/createPostComment.service';
import { GetPostCommentService } from './services/getComment.service';

@Module({
  imports: [DatabaseModule, MikroOrmModule.forFeature([PostEntity, PostCommentEntity], 'mongo')],
  controllers: [AppController],
  providers: [CreatePostCommentService, GetPostCommentService],
})
export class AppModule {}
