import { Controller } from '@nestjs/common';
import { SubscriptionService } from './services/subscriptionService';

@Controller()
export class AppController {
  constructor(private readonly subscriptionService: SubscriptionService) { }


}
