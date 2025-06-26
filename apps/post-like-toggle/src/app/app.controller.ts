import { Controller } from '@nestjs/common';
import { LikeService } from './services/likeToggle.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ToggleLikeDto } from 'libs/dtos/src/lib/LikeToggle.dto';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @MessagePattern({ cmd: 'post_like_toggle' })
  async toggleReaction(@Payload() dto: ToggleLikeDto & { userId: string }) {
    return this.likeService.toggleLikeOrDislike(dto.userId, dto.postId, dto.action);
  }
}