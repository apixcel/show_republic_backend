import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { ChallengeDto } from '@show-republic/dtos';
import { ChallengeEntity } from '@show-republic/entities';

export class GameficationService {
  constructor(
    @InjectEntityManager('mongo') // Inject EntityManager for MongoDB context
    private readonly em: EntityManager,
  ) {}
  async createChellenge(payload: ChallengeDto) {
    const forkedEm = this.em.fork();
    const challengeRepo = forkedEm.getRepository(ChallengeEntity);
    const challenge = challengeRepo.create(payload);
    await forkedEm.flush();

    return challenge;
  }
}
