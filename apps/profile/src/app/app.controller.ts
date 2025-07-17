import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UpdateUserDto } from '@show-republic/dtos';
import { ProfileService } from './services/profileService';

@Controller()
export class AppController {
  constructor(private readonly profileService: ProfileService) {}
  @MessagePattern({ cmd: 'my_profile' })
  async getUserProfile(userId: string) {
    return await this.profileService.getUserProfile(userId);
  }
  @MessagePattern({ cmd: 'update_profile' })
  async updateUserProfile({ userId, userProfileDto }: { userId: string; userProfileDto: UpdateUserDto }) {
    return await this.profileService.updateUserProfile(userProfileDto, userId);
  }
}
