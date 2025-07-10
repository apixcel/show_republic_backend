import { Controller } from '@nestjs/common';
import { ProfileService } from './services/profileService';

@Controller()
export class AppController {
  constructor(private readonly profileService: ProfileService) { }


}
