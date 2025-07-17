import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BrandDto } from '@show-republic/dtos';
import { BrandEntity } from '@show-republic/entities';

@Injectable()
export class BrandService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly em: EntityManager,
  ) {}

  async createBrand(payload: BrandDto, userId: string) {
    const forkedEm = this.em.fork();
    const brandRepo = forkedEm.getRepository(BrandEntity);

    const isUserHadBrand = await brandRepo.findOne({
      user: userId,
    });

    if (isUserHadBrand) {
      throw new RpcException('You already have a brand');
    }

    const brand = brandRepo.create({
      ...payload,
      user: userId,
    });

    await forkedEm.persistAndFlush(brand);
    return brand;
  }

  async getUserBrandDetails(userId: string) {
    const forkedEm = this.em.fork();
    const brandRepo = forkedEm.getRepository(BrandEntity);
    const brand = await brandRepo.findOne({ user: userId });
    return brand;
  }
}
