import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  CategoryDto,
  CreatePostCommentDto,
  CreatePostDto,
  ToggleLikeDto,
  UpdatePostDto,
  UserDto,
} from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt')) // Use the built-in JwtAuthGuard directly
@Controller('post')
export class PostController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // ***** Create Post*******

  @Post('create_post')
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.userId;
    const data = { ...createPostDto, userId: userId };
    const postData = await lastValueFrom(this.natsClient.send({ cmd: 'createPost' }, data));
    return postData;
  }
  @Put('update/:postId')
  async updatePost(@Body() payload: UpdatePostDto, @Request() req: any) {
    const userId = req.user.userId;
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'updatePost' }, { payload: payload, userId, postId: req.params.postId }),
    );
    return postData;
  }
  @Delete('delete/:postId')
  async deletePostById(@Request() req: any) {
    const userId = req.user.userId;
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'deletePost' }, { userId, postId: req.params.postId }),
    );
    return postData;
  }

  // *****View post*******
  @Get('view_post')
  async getPost(@Request() req: any) {
    // If the token is valid, `req.user` will contain the user info
    const userId = req.user.userId;
    const postData = await lastValueFrom(this.natsClient.send({ cmd: 'viewPost' }, userId));
    return postData;
  }

  // ***** View all posts *******
  @Get('view_all')
  async getAllPosts(@Request() req: any) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const limit = req.query?.limit ? Number(req.query.limit) : 30;
    const currentUserId = req.user.userId;
    const userId = req.query.userId;
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'viewAllPosts' }, { page, limit, currentUserId, userId }),
    );
    return postData;
  }

  @Get('view_post/:postId')
  async viewPostByPostId(@Param('postId') postId: string, @Req() req: any) {
    const userId = req.user.userId;
    const postData = await lastValueFrom(this.natsClient.send({ cmd: 'viewPostByPostId' }, { postId, userId }));
    return postData;
  }

  // ----post reaction api start ----
  @Post('reaction/toggle')
  async toggleLike(@Body() likeToggleDto: ToggleLikeDto, @Request() req: any) {
    const userId = req.user.userId;
    const data = { ...likeToggleDto, userId };

    return await lastValueFrom(this.natsClient.send({ cmd: 'post_like_toggle' }, data));
  }
  //------ post comment api start ------
  @Post('/comment/create/:postId')
  async createPostComment(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @Req() req: any,
    @Param('postId') postId: string,
  ) {
    const userId = req.user.userId;

    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'create_post_comment' }, { postId, userId, payload: createPostCommentDto }),
    );
    return order;
  }
  @Get('/comment/get/:postId')
  async getPostComment(@Param('postId') postId: string, @Req() req: any) {
    const userId = req.user?.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_post_comment' }, { userId, postId }));
    return order;
  }
  @Get('/comment/get/replies-of/:commentId')
  async getAllCommentReplyByCommentId(@Param('commentId') commentId: string, @Req() req: any) {
    const userId = req.user?.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_post_comment_replies' }, { commentId, userId }));
    return order;
  }
  @Put('/comment/react/t/:commentId')
  async togglePostCommentReaction(@Param('commentId') commentId: string, @Req() req: any) {
    const userId = req.user?.userId;
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'toggle_post_comment_reaction' }, { commentId, userId }),
    );
    return order;
  }

  // ----- post category type api startr ----

  @Post('/category/create')
  async createCategory(@Body() createCategoryData: CategoryDto) {
    return await lastValueFrom(this.natsClient.send({ cmd: 'category_create' }, createCategoryData));
  }

  @Get('/category/get')
  async getAllCategory() {
    return await lastValueFrom(this.natsClient.send({ cmd: 'category_getall' }, {}));
  }

  @Put('/category/update/user-interests')
  async updateCategory(@Body() categoryIds: Pick<UserDto, 'interests'>, @Request() req: any) {
    const user = req.user || {};
    return await lastValueFrom(
      this.natsClient.send(
        { cmd: 'category_user_interest_update' },
        { categoryIds: categoryIds.interests, userId: user.userId },
      ),
    );
  }
}
