import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { NotificationEntity } from '@show-republic/entities';

export class AdminNotificatonService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}

  async getAdminNotification(adminId: string, query: Record<string, any>) {
    const forkedEm = this.em.fork();
    const notificationRepo = forkedEm.getRepository(NotificationEntity);

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const [notifications, total] = await notificationRepo.findAndCount(
      {
        $or: [{ user: adminId }, { user: null }, { user: { $exists: false } }],
      },
      {
        limit,
        offset,
        orderBy: { createdAt: 'desc' },
      },
    );

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
