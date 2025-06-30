import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { AdminEntity } from '@show-republic/entities';

export class AdminManagementService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}

  async getAllAdmins(query: Record<string, any> = {}) {
    const page = Number(query?.page || 0) > 0 ? Number(query.page) : 1;
    const limit = Number(query?.limit || 0) > 0 ? Number(query.limit) : 10;
    const offset = (page - 1) * limit;

    const adminRepo = this.em.fork().getRepository(AdminEntity);

    const queryFilter: Record<string, any> = {};

    // Search filter: by firstName or email
    if (query.searchTerm) {
      queryFilter.$or = [
        { firstName: { $regex: query.searchTerm, $options: 'i' } },
        { lastName: { $regex: query.searchTerm, $options: 'i' } },
        { email: { $regex: query.searchTerm, $options: 'i' } },
      ];
    }

    const [admins, total] = await adminRepo.findAndCount(queryFilter as any, {
      limit,
      offset,
      orderBy: { createdAt: query.sort === 'asc' ? 'asc' : 'desc' },
    });

    return {
      data: admins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
