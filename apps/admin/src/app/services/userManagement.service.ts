import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { RpcException } from '@nestjs/microservices';
import { PostEntity, UserEntity, UserStatus } from '@show-republic/entities';
import { isUUID } from 'class-validator';

export class UserManagementService {
  constructor(
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,

    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,
  ) {}

  async getAllUsers(query: Record<string, any> = {}) {
    const forkedEm = this.pgEm.fork();
    const userRepo = forkedEm.getRepository(UserEntity);

    const page = Number(query?.page || 0) > 0 ? Number(query.page) : 1;
    const limit = Number(query?.limit || 0) > 0 ? Number(query.limit) : 10;
    const offset = (page - 1) * limit;

    const qb = userRepo
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.createdAt', 'u.userName', 'u.firstName', 'u.lastName', 'u.country', 'u.status'])
      .offset(offset)
      .limit(limit)
      .orderBy({ 'u.createdAt': query.sort === 'asc' ? 'asc' : 'desc' });

    if (query.status) {
      qb.andWhere({ status: query.status });
    }

    if (query.searchTerm) {
      qb.andWhere('(u.first_name ILIKE ? OR u.email ILIKE ?)', [`%${query.searchTerm}%`, `%${query.searchTerm}%`]);
    }

    const [users, total] = await qb.getResultAndCount();

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async changeUserStatus(userId: string, status: UserStatus) {
    if (!userId || !isUUID(userId)) {
      throw new RpcException('Invalid user ID');
    }
    const forkedEm = this.pgEm.fork();
    const userRepo = forkedEm.getRepository(UserEntity);

    const user = await userRepo.findOne({ id: userId });

    if (!user) {
      throw new RpcException('User not found');
    }

    user.status = status;
    await forkedEm.persistAndFlush(user);
    return { ...user, password: undefined, preferences: undefined };
  }

  async getUserProfileState(userId: string) {
    const forkedEm = this.pgEm.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const postRepo = forkedEm.getRepository(PostEntity);

    const user = await userRepo.findOne({ id: userId });
    if (!user) {
      throw new RpcException('User not found');
    }

    const postCount = await postRepo.count({ userId: user.id });
    const totalEarnings = 441;

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        country: user.country,
        contactNumber: user.contactNumber,
        status: user.status,
      },
      postCount,
      totalEarnings,
    };
  }
}
