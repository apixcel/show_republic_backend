import { Controller } from '@nestjs/common';
import { PromotionService } from './services/promotionService';

@Controller()
export class AppController {
  constructor(private readonly PromotionService: PromotionService) { }


}
