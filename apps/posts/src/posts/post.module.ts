import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { LikeEntity, PostEntity, UserEntity } from '@show-republic/entities';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';
import { PostCommentService } from './services/postComment.service';
import { PostReactionService } from './services/postReaction.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([PostEntity, LikeEntity], 'mongo'), // Use 'mongo' context here
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
  ],
  controllers: [PostController],
  providers: [PostService, PostReactionService, PostCommentService],
})
export class PostModule {}
