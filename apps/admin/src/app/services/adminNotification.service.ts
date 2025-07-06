import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { UpdateNotificationPreferencesDto } from '@show-republic/dtos';
import { NotificationEntity } from '@show-republic/entities';
import { NotificationUtilService } from 'libs/utils/src/lib/notification.util';

export class AdminNotificatonService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,

    private readonly notificationUtilService: NotificationUtilService,
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

  async getAdminNotificationPreference(adminId: string) {
    const result = await this.notificationUtilService.getUserNotificationPreferences(adminId);
    return result;
  }

  async updateAdminNotificationPreference(adminId: string, payload: UpdateNotificationPreferencesDto) {
    const forkedEm = this.em.fork();
    const preference = await this.notificationUtilService.getUserNotificationPreferences(adminId);

    const updatedPreferences = { ...preference.preferences };

    for (const key of Object.keys(payload) as (keyof UpdateNotificationPreferencesDto)[]) {
      if (payload[key]) {
        // If existing section exists, merge, else set new
        updatedPreferences[key] = {
          ...updatedPreferences[key],
          ...payload[key],
        };
      }
    }

    preference.preferences = updatedPreferences;

    await forkedEm.persistAndFlush(preference);
    return preference;
  }
}
