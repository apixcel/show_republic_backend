import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto } from '@show-republic/dtos';
import { ProductService } from './services/product.service';

@Controller()
export class AppController {
  constructor(private readonly prdouctService: ProductService) {}

  @MessagePattern({ cmd: 'product_create' })
  createProduct({ ceateProductDto, userId }: { ceateProductDto: CreateProductDto; userId: string }) {
    return this.prdouctService.createProduct(ceateProductDto, userId);
  }
}
