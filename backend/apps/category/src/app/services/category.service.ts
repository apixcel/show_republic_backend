import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { HttpException } from '@nestjs/common';
import { CategoryEntity, UserEntity } from '@show-republic/entities';
import { CategoryDto } from 'libs/dtos/src/lib/Category.dto';

export class CategoryService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,
  ) {}

  async createCategory(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const em = this.em.fork();
    const categoryRepo = em.getRepository(CategoryEntity);
    const isExist = await categoryRepo.findOne({
      $or: [{ label: categoryDto.label }, { value: categoryDto.value }],
    });

    if (isExist) {
      throw new HttpException(
        {
          meessage: 'Category already exist',
        },
        400,
      );
    }

    const category = categoryRepo.create({
      label: categoryDto.label,
      value: categoryDto.value,
    });
    await em.persistAndFlush(category);
    return category;
  }
  async getAllCategory(): Promise<CategoryEntity[]> {
    const categoryRepo = this.em.fork().getRepository(CategoryEntity);
    return categoryRepo.findAll();
  }

  async updateUserCategoryInterest({
    categoryIds,
    userId,
  }: {
    categoryIds: string[];
    userId: string;
  }) {
    const forkedEm = this.em.fork();
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

  test(): string {
    return 'Hello World!';
  }
}
