import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryDto } from '@show-republic/dtos';
import { CategoryEntity } from '@show-republic/entities';
import { CategoryService } from './services/category.service';

@Controller()
export class AppController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern({ cmd: 'category_create' })
  createCategory(categoryDto: CategoryDto): Promise<CategoryEntity> {
    return this.categoryService.createCategory(categoryDto);
  }
  @MessagePattern({ cmd: 'category_getall' })
  getAllCategory(): Promise<CategoryEntity[]> {
    return this.categoryService.getAllCategory();
  }
  @MessagePattern({ cmd: 'category_user_interest_update' })
  updateUserCategoryInterest({
    categoryIds,
    userId,
  }: {
    categoryIds: string[];
    userId: string;
  }) {
    return this.categoryService.updateUserCategoryInterest({
      categoryIds,
      userId,
    });
  }
  @MessagePattern({ cmd: 'sample_test' })
  test(): string {
    return this.categoryService.test();
  }
}
