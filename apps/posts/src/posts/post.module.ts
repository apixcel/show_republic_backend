import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { CategoryEntity, LikeEntity, PostEntity, UserEntity } from '@show-republic/entities';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';
import { PostCategoryService } from './services/postCataegory.service';
import { PostCommentService } from './services/postComment.service';
import { PostReactionService } from './services/postReaction.service';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([PostEntity, LikeEntity], 'mongo'),
    MikroOrmModule.forFeature([UserEntity, CategoryEntity], 'postgres'),
  ],
  controllers: [PostController],
  providers: [PostService, PostReactionService, PostCommentService, PostCategoryService],
})
export class PostModule {}
