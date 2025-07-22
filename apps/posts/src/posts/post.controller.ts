import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryDto, CreatePostCommentDto, CreatePostDto, ToggleLikeDto, UpdatePostDto } from '@show-republic/dtos';
import { CategoryEntity } from '@show-republic/entities';
import { PostService } from './services/post.service';
import { PostCategoryService } from './services/postCataegory.service';
import { PostCommentService } from './services/postComment.service';
import { PostReactionService } from './services/postReaction.service';

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postReactionService: PostReactionService,
    private readonly postCommentService: PostCommentService,
    private readonly postCategoryService: PostCategoryService,
  ) {}

  // ****** Create Post *******
  @MessagePattern({ cmd: 'createPost' })
  async createPost(createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }
  @MessagePattern({ cmd: 'updatePost' })
  async updatePost({ payload, userId, postId }: { payload: UpdatePostDto; userId: string; postId: string }) {
    return await this.postService.updatePost(userId, payload, postId);
  }
  @MessagePattern({ cmd: 'deletePost' })
  async deletePostById({ userId, postId }: { userId: string; postId: string }) {
    return await this.postService.deletePostById(userId, postId);
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
    userId,
  }: { page?: number; limit?: number; currentUserId?: string; userId?: string } = {}) {
    return await this.postService.viewAll(page, limit, currentUserId, userId);
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

  // ------ post category type api start ------
  @MessagePattern({ cmd: 'category_create' })
  createCategory(categoryDto: CategoryDto): Promise<CategoryEntity> {
    return this.postCategoryService.createCategory(categoryDto);
  }
  @MessagePattern({ cmd: 'category_getall' })
  getAllCategory(): Promise<CategoryEntity[]> {
    return this.postCategoryService.getAllCategory();
  }
  @MessagePattern({ cmd: 'category_user_interest_update' })
  updateUserCategoryInterest({ categoryIds, userId }: { categoryIds: string[]; userId: string }) {
    return this.postCategoryService.updateUserCategoryInterest({
      categoryIds,
      userId,
    });
  }
}
