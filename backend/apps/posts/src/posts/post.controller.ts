import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePostDto } from '@show-republic/dtos';
import { ViewPostService } from './services/ViewPost.service';
import { CreatePostService } from './services/createpost.service';
import { ViewAllPostService } from './services/ViewAllPost.service';

@Controller()
export class PostController {
  constructor(private readonly createPostService: CreatePostService,
    private readonly viewPostService: ViewPostService,
    private readonly viewAllPostService: ViewAllPostService
  ) { }

  // ****** Create Post *******
  @MessagePattern({ cmd: 'createPost' })
  async createPost(createPostDto: CreatePostDto) {
    return await this.createPostService.create(createPostDto); // Handle login and return the access token
  }

  // ****** View Post *******
  @MessagePattern({ cmd: 'viewPost' })
  async viewProduct(userId: string): Promise<any> {
    return await this.viewPostService.view(userId);
  }

  // ****** View All Post *******
  @MessagePattern({ cmd: 'viewAllPosts' })
  async viewAllPosts({ page = 1, limit = 30 }: { page?: number; limit?: number } = {}): Promise<any> {
    return await this.viewAllPostService.viewAll(page, limit);
  }

}
