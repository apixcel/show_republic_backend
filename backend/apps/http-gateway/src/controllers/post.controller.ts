import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from '@show-republic/dtos';
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
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'createPost' }, data),
    );
    return postData;
  }

  // *****View post*******
  @Get('view_post')
  async getPost(@Request() req: any) {
    // If the token is valid, `req.user` will contain the user info
    const userId = req.user.userId;
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'viewPost' }, userId),
    );
    return postData;
  }



  // ***** View all posts *******
  @Get('view_all')
  async getAllPosts(@Request() req: any) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const limit = req.query?.limit ? Number(req.query.limit) : 30;
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'viewAllPosts' }, { page, limit })
    );
    return postData;
  }

}
