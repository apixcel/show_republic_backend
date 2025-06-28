import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatorService } from './services/creator.service';

@Controller()
export class AppController {
  constructor(private readonly creatorService: CreatorService) {}

  @MessagePattern({ cmd: 'create_creator_profile' })
  createCreatorProfile(payload: any): string {
    return this.creatorService.createCreatorAccount(payload);
  }
}
