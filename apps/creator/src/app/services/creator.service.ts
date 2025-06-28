import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';

export class CreatorService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}
  createCreatorAccount(payload: any) {
    return 'Hello World!';
  }
}
