import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { SubscribeToCreatorDto } from '@show-republic/dtos';

export class CreatorService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}

  async subscribeToCreatorAccount(subscribeToCreatorDto: SubscribeToCreatorDto) {

    
    return '';
  }
}
