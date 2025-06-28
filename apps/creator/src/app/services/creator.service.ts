import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { CreatorDto } from '@show-republic/dtos';
import { CreatorEntity, UserEntity } from '@show-republic/entities';

export class CreatorService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly em: EntityManager,
  ) {}

  async createCreatorAccount(payload: CreatorDto, userId: string) {
    const forkedEm = this.em.fork();

    const existing = await forkedEm.findOne(CreatorEntity, {
      user: userId,
    });

    if (existing) {
      throw new RpcException('Creator account already exists for this user.');
    }
    const creatorRepo = forkedEm.getRepository(CreatorEntity);

    const user = forkedEm.getReference(UserEntity, userId);

    const creator = creatorRepo.create({
      ...payload,
      user,
    });

    await forkedEm.persistAndFlush(creator);
    return creator;
  }

  async getUserCreatorAccount(userId: string) {
    const forkedEm = this.em.fork();
    const creatorRepo = forkedEm.getRepository(CreatorEntity);
    const creator = await creatorRepo.findOne({ user: userId });
    return creator;
  }
}
