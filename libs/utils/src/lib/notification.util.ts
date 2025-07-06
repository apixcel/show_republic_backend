import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { NotificationPreferencesEntity } from '@show-republic/entities';

@Injectable()
export class NotificationUtilService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}

  async getUserNotificationPreferences(userId: string) {
    const forkedEm = this.em.fork();
    const notificationPreferencesRepo = forkedEm.getRepository(NotificationPreferencesEntity);

    const notificationPreferences = await notificationPreferencesRepo.findOne({ user: userId });
    if (notificationPreferences) {
      return notificationPreferences;
    }
    const newNotificationPreferences = notificationPreferencesRepo.create({
      user: userId,
      preferences: {
        loginActivities: {
          push: true,
          email: true,
        },
        reminders: {
          push: true,
          email: true,
        },
      },
    });
    await forkedEm.persistAndFlush(newNotificationPreferences);
    return newNotificationPreferences;
  }
}
