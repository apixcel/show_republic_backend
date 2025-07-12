import { Controller } from '@nestjs/common';
import { LiveService } from './services/liveService';

@Controller()
export class AppController {
  constructor(private readonly liveService: LiveService) { }


}
