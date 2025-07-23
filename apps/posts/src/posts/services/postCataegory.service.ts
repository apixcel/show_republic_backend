import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CategoryEntity, UserEntity } from '@show-republic/entities';
import { CategoryDto } from 'libs/dtos/src/lib/Category.dto';

export class PostCategoryService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}

  async onModuleInit() {
    const em = this.pgEm.fork();
    const categoryRepo = em.getRepository(CategoryEntity);

    const defaultCategories: { label: string; value: string }[] = [
      { label: 'Gaming', value: 'gaming' },
      { label: 'Technology', value: 'technology' },
      { label: 'Sports', value: 'sports' },
      { label: 'Gardening', value: 'gardening' },
      { label: 'Entertainment', value: 'entertainment' },
      { label: 'Fitness', value: 'fitness' },
    ];

    for (const cat of defaultCategories) {
      const exists = await categoryRepo.findOne({
        $or: [{ label: cat.label }, { value: cat.value }],
      });

      if (!exists) {
        const newCategory = categoryRepo.create(cat);
        await em.persistAndFlush(newCategory);
        console.log(`[Category Seed] Created: ${cat.label}`);
      } else {
        console.log(`[Category Seed] Already exists: ${cat.label}`);
      }
    }
  }
  async createCategory(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const em = this.pgEm.fork();
    const categoryRepo = em.getRepository(CategoryEntity);
    const isExist = await categoryRepo.findOne({
      $or: [{ label: categoryDto.label }, { value: categoryDto.value }],
    });

    if (isExist) {
      throw new RpcException('Category already exist with same label or value');
    }

    const category = categoryRepo.create({
      label: categoryDto.label,
      value: categoryDto.value,
    });
    await em.persistAndFlush(category);
    return category;
  }
  async getAllCategory(): Promise<CategoryEntity[]> {
    const categoryRepo = this.pgEm.fork().getRepository(CategoryEntity);
    return categoryRepo.findAll();
  }

  async updateUserCategoryInterest({ categoryIds, userId }: { categoryIds: string[]; userId: string }) {
    const forkedEm = this.pgEm.fork();
    const categoryRepo = forkedEm.getRepository(CategoryEntity);
    const userRepo = forkedEm.getRepository(UserEntity);

    const user = await userRepo.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const categories = await categoryRepo.find({ id: { $in: categoryIds } });

    if (categories.length !== categoryIds.length) {
      throw new HttpException('One or more categories not found', 404);
    }
    user.interests.set(categories);
    await forkedEm.persistAndFlush(user);
    return { ...user, password: undefined, preferences: undefined };
  }
}
