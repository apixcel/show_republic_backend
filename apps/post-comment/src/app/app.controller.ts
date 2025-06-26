import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePostCommentDto } from '@show-republic/dtos';
import { CreatePostCommentService } from './services/createPostComment.service';
import { GetPostCommentService } from './services/getComment.service';

@Controller()
export class AppController {
  constructor(
    private readonly createPostCommentService: CreatePostCommentService,
    private readonly getPostCommentService: GetPostCommentService,
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
  getPostComment(postId: string) {
    return this.getPostCommentService.getCommentByPostId(postId);
  }
  @MessagePattern({ cmd: 'get_post_comment_replies' })
  getAllCommentReplyByCommentId(commentId: string) {
    return this.getPostCommentService.getAllCommentReplyByCommentId(commentId);
  }
 
}
