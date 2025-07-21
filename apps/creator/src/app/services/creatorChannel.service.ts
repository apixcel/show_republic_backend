import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { PostEntity } from '@show-republic/entities';

export class CreatorChannelService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,
  ) {}

  async getUserChannelShows({
    userId,
    page = 1,
    limit = 10,
    sort = 'desc',
    sortBy = 'createdAt',
  }: {
    userId: string;
    page?: number;
    limit?: number;
    sort?: string;
    sortBy?: string;
  }) {
    const mongoFokedEm = this.mongoEm.fork();

    const postRepo = mongoFokedEm.getRepository(PostEntity);

    const posts = await postRepo.find(
      {
        userId: userId,
      },
      {
        orderBy: {
          [sortBy]: sort,
        },
        limit,
        offset: (page - 1) * limit,
      },
    );

    const totalPost = await postRepo.count({ userId: userId });

    return { posts, totalPost };
  }
}
