import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePostCommentDto } from '@show-republic/dtos';
import { CreatePostCommentService } from './services/createPostComment.service';
import { GetPostCommentService } from './services/getComment.service';
import { PostCommentReactionService } from './services/postCommentReaction.service';

@Controller()
export class AppController {
  constructor(
    private readonly createPostCommentService: CreatePostCommentService,
    private readonly getPostCommentService: GetPostCommentService,
    private readonly postCommentReactionService: PostCommentReactionService,
  ) {}

  @MessagePattern({ cmd: 'create_post_comment' })
  createCommentByPostId({
    userId,
    payload,
    postId,
  }: {
    postId: string;
    payload: CreatePostCommentDto;
    userId: string;
  }) {
    return this.createPostCommentService.createCommentByPostId(postId, payload, userId);
  }
  @MessagePattern({ cmd: 'get_post_comment' })
  getPostComment({ postId, userId }: { postId: string; userId: string }) {
    return this.getPostCommentService.getCommentByPostId(postId, userId);
  }
  @MessagePattern({ cmd: 'get_post_comment_replies' })
  getAllCommentReplyByCommentId({ commentId, userId }: { commentId: string; userId: string }) {
    return this.getPostCommentService.getAllCommentReplyByCommentId(commentId, userId);
  }

  @MessagePattern({ cmd: 'toggle_post_comment_reaction' })
  togglePostCommentReaction({ commentId, userId }: { commentId: string; userId: string }) {
    return this.postCommentReactionService.togglePostCommentReaction(commentId, userId);
  }
}
