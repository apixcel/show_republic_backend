import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostCommentDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt')) // Use the built-in JwtAuthGuard directly
@Controller('comment')
export class PostCommentController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create/:postId')
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
  @Get('get/:postId')
  async getPostComment(@Param('postId') postId: string) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_post_comment' }, postId));
    return order;
  }
  @Get('get/replies-of/:postId')
  async getAllCommentReplyByCommentId(@Param('postId') postId: string) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_post_comment_replies' }, postId));
    return order;
  }
}
