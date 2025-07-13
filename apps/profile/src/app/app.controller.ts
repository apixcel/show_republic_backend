import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileService } from './services/profileService';

@Controller()
export class AppController {
  constructor(private readonly profileService: ProfileService) {}
  @MessagePattern({ cmd: 'my_profile' })
  async getUserProfile(userId: string) {
    return await this.profileService.getUserProfile(userId);
  }
}
