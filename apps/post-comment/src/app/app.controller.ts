
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostCommentService } from './services/PostComment.service';

@Controller()
export class AppController {
  constructor(private readonly PostCommentService: PostCommentService) {}

  @MessagePattern({ cmd: 'sample_test' })
  test(): string {
    return this.PostCommentService.test();
  }
}


