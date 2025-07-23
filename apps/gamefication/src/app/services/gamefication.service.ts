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
    const challenge = challengeRepo.create({
      ...payload,
      startTime: payload.startTime || undefined,
    });
    await forkedEm.flush();

    return challenge;
  }

  private extractPagination(query: Record<string, any>) {
    const limit = query?.limit ? parseInt(query.limit, 10) : undefined;
    const page = query?.page ? parseInt(query.page, 10) : 1;

    const offset = limit !== undefined ? (page - 1) * limit : undefined;

    return { limit, offset };
  }

  async getUpcommingChellenge(query: Record<string, any>) {
    const forkedEm = this.em.fork();
    const challengeRepo = forkedEm.getRepository(ChallengeEntity);
    const now = new Date();

    const { limit, offset } = this.extractPagination(query);

    const upcomingChallenges = await challengeRepo.find(
      { startTime: { $gt: now } },
      limit !== undefined ? { limit, offset } : {},
    );

    return upcomingChallenges;
  }

  async getActiveChallenge(query: Record<string, any>) {
    const forkedEm = this.em.fork();
    const challengeRepo = forkedEm.getRepository(ChallengeEntity);
    const now = new Date();

    const { limit, offset } = this.extractPagination(query);

    const activeChallenges = await challengeRepo.find(
      {
        endTime: { $gt: now },
        // $or: [{ startTime: null }, { startTime: { $lte: now } }],
      },
      limit !== undefined ? { limit, offset } : {},
    );

    return activeChallenges;
  }

  async getCompletedChallenges(query: Record<string, any>) {
    const forkedEm = this.em.fork();
    const challengeRepo = forkedEm.getRepository(ChallengeEntity);
    const now = new Date();

    const { limit, offset } = this.extractPagination(query);

    const completedChallenges = await challengeRepo.find(
      { endTime: { $lt: now } },
      limit !== undefined ? { limit, offset } : {},
    );

    return completedChallenges;
  }
}
