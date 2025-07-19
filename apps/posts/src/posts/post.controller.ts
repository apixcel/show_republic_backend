import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePostCommentDto, CreatePostDto, ToggleLikeDto } from '@show-republic/dtos';
import { PostService } from './services/post.service';
import { PostCommentService } from './services/postComment.service';
import { PostReactionService } from './services/postReaction.service';

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postReactionService: PostReactionService,
    private readonly postCommentService: PostCommentService,
  ) {}

  // ****** Create Post *******
  @MessagePattern({ cmd: 'createPost' })
  async createPost(createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto); // Handle login and return the access token
  }

  // ****** View users post *******
  @MessagePattern({ cmd: 'viewPost' })
  async viewProduct(userId: string): Promise<any> {
    return await this.postService.viewMyPost(userId);
  }

  // ****** View All Post *******
  @MessagePattern({ cmd: 'viewAllPosts' })
  async viewAllPosts({
    page = 1,
    limit = 30,
    currentUserId,
  }: { page?: number; limit?: number; currentUserId?: string } = {}): Promise<any> {
    return await this.postService.viewAll(page, limit, currentUserId);
  }

  @MessagePattern({ cmd: 'viewPostByPostId' })
  async viewPostByPostId({ postId, userId }: { postId: string; userId: string }): Promise<any> {
    return await this.postService.viewPostByPostId(postId, userId);
  }

  // ----- post reaction api start -----
  @MessagePattern({ cmd: 'post_like_toggle' })
  async toggleReaction(dto: ToggleLikeDto & { userId: string }) {
    return this.postReactionService.toggleLikeOrDislike(dto.userId, dto.postId, dto.action);
  }

  // ---- post comment api start ------

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
    return this.postCommentService.createCommentByPostId(postId, payload, userId);
  }

  @MessagePattern({ cmd: 'get_post_comment' })
  getPostComment({ postId, userId }: { postId: string; userId: string }) {
    return this.postCommentService.getCommentByPostId(postId, userId);
  }
  @MessagePattern({ cmd: 'get_post_comment_replies' })
  getAllCommentReplyByCommentId({ commentId, userId }: { commentId: string; userId: string }) {
    return this.postCommentService.getAllCommentReplyByCommentId(commentId, userId);
  }

  @MessagePattern({ cmd: 'toggle_post_comment_reaction' })
  togglePostCommentReaction({ commentId, userId }: { commentId: string; userId: string }) {
    return this.postCommentService.togglePostCommentReaction(commentId, userId);
  }
}
