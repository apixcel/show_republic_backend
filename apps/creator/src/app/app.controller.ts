import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatorDto } from '@show-republic/dtos';
import { CreatorService } from './services/creator.service';

@Controller()
export class AppController {
  constructor(private readonly creatorService: CreatorService) {}

  @MessagePattern({ cmd: 'create_creator_profile' })
  createCreatorProfile({ payload, userId }: { payload: CreatorDto; userId: string }) {
    return this.creatorService.createCreatorAccount(payload, userId);
  }
  @MessagePattern({ cmd: 'get_creator_profile' })
  getUserCreatorAccount(userId: string) {
    return this.creatorService.getUserCreatorAccount(userId);
  }
}
