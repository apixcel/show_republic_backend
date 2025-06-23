import {
  Controller,
  Post,
  Body,
  Inject,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreatePostDto } from '@show-republic/dtos';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Use the built-in JwtAuthGuard directly
@Controller('post')
export class PostController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  // ***** Create Post*******

  @Post('create_post')
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.userId;
    const data = { ...createPostDto, userId: userId };
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'createPost' }, data) // Ensure command name matches
    );
    return postData;
  }

  // *****View post*******
  @Get('view_post')
  async getPost(@Request() req: any) {
    // If the token is valid, `req.user` will contain the user info
    const userId = req.user.userId;
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'viewPost' }, userId) // Ensure command name matches
    );
    return postData;
  }



  // ***** View all posts *******
  @Get('view_all')
  async getAllPosts() {
    const postData = await lastValueFrom(
      this.natsClient.send({ cmd: 'viewAllPosts' }, {}) // Send empty payload or as needed
    );
    return postData;
  }

}
