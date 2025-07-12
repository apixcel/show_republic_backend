import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';


@Injectable()
export class WalletService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) { }






}
