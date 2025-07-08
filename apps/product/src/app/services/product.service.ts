import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { CreateProductDto } from '@show-republic/dtos';
import { ProductEntity } from '@show-republic/entities';

export class ProductService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}
  async createProduct(createProductDto: CreateProductDto, userId: string) {
    const forkedEm = this.em.fork();
    const productRepo = forkedEm.getRepository(ProductEntity);
    const product = productRepo.create({
      ...createProductDto,
      userId,
    });
    await forkedEm.persistAndFlush(product);
    return product;
  }
}
