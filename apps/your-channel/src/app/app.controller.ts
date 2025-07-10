import { Controller } from '@nestjs/common';
import { YouChannelService } from './services/yourChannelService';

@Controller()
export class AppController {
  constructor(private readonly yourChannelService: YouChannelService) { }


}
