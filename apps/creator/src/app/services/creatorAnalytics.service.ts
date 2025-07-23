import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { PostViewEntity } from '@show-republic/entities';

@Injectable()
export class CreatorAnalyticsService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}

  async getViewAnalytics(postId: string, query: Record<string, any>) {
    const range = query.range || '7';

    let days = Number(range);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1));

    // Mongo aggregation
    const knex = this.em.getConnection().getCollection(PostViewEntity);
    const rawData = await knex
      .aggregate([
        {
          $match: {
            postId: new ObjectId(postId), // 🔥 convert here
            viewedAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const rawMap = Object.fromEntries(rawData.map((d) => [d._id, d.count]));

    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]); // Format YYYY-MM-DD
    }

    const data = dates.map((date) => ({
      date,
      views: rawMap[date] ?? 0,
    }));

    const totalViews = data.reduce((sum, d) => sum + d.views, 0);

    return {
      totalViews,
      data,
    };
  }
}
