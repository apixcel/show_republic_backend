import { Controller } from '@nestjs/common';
import { NotificationService } from './services/notificationService';

@Controller()
export class AppController {
  constructor(private readonly notificationService: NotificationService) {}
}
