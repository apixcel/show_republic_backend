import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BrandDto } from '@show-republic/dtos';
import { BrandService } from './services/brandService';

@Controller()
export class AppController {
  constructor(private readonly brandService: BrandService) {}

  @MessagePattern({ cmd: 'create_brand' })
  createCreatorProfile({ payload, userId }: { payload: BrandDto; userId: string }) {
    return this.brandService.createBrand(payload, userId);
  }
  @MessagePattern({ cmd: 'get_my_brand' })
  getUserBrandDetails(userId: string) {
    return this.brandService.getUserBrandDetails(userId);
  }
}
