import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@show-republic/entities';

@Injectable()
export class ProfileService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly em: EntityManager,
  ) {}

  async getUserProfile(userId: string) {
    console.log(userId);

    const user = await this.em.fork().getRepository(UserEntity).findOne({ id: userId });
    return {
      ...user,
      password: undefined,
    };
  }
}
