import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { AdminEntity } from '@show-republic/entities';
import { plainToClass } from 'class-transformer';
import { MongoEntityRepository } from '@mikro-orm/mongodb';

@Injectable()
export class ViewUsersService {
  constructor(
    @InjectRepository(AdminEntity, 'mongo')
    private readonly userRepository: MongoEntityRepository<AdminEntity>,

    @InjectEntityManager('mongo') // Inject EntityManager for PostgreSQL context
    private readonly em: EntityManager,
  ) { }

  async view(): Promise<AdminEntity[]> {
    // Use a forked EntityManager to isolate transaction
    const admins = await this.em.fork().getRepository(AdminEntity).findAll();
    const adminList: AdminEntity[] = [];

    for (let index = 0; index < admins.length; index++) {
      const element = admins[index];
      adminList.push(plainToClass(AdminEntity, element, { excludeExtraneousValues: true }))
    }

    return adminList;
  }
}
