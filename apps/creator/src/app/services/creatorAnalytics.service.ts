import { EntityManager as MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager as PostgresEntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { PostViewEntity, SubscriptionEntity } from '@show-republic/entities';

@Injectable()
export class CreatorAnalyticsService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly mongEm: MongoEntityManager,

    @InjectEntityManager('postgres')
    private readonly pgEm: PostgresEntityManager,
  ) {}

  async getPostAnalyticsOverview(postId: string) {
    const forkedMongoEm = this.mongEm.fork();
    const forkedPgEm = this.pgEm.fork();
    const totalViews = await forkedMongoEm.getRepository(PostViewEntity).count({ postId });
    const totalSubscribers = await forkedPgEm.getRepository(SubscriptionEntity).count({ postId });

    const post = await forkedMongoEm.getRepository(PostViewEntity).findOne({ postId });

    return { totalViews, totalSubscribers, totalWatchTime: 80, post };
  }

  async getViewAnalytics(postId: string, query: Record<string, any>) {
    const range = query.range || '7';
    const days = Number(range);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const knex = this.mongEm.getConnection().getCollection(PostViewEntity);
    const rawData = await knex
      .aggregate([
        {
          $match: {
            postId: new ObjectId(postId),
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

    const dates = Array.from({ length: days }).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

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

  async getSubscriptionAnalyticsByPostId(postId: string, query: Record<string, any>) {
    const range = query.range || '7';
    const days = Number(range);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const raw = await this.pgEm.execute(
      `
    SELECT
      DATE("created_at") as date,
      COUNT(*)::int as count
    FROM "subscription_entity"
    WHERE "post_id" = ? AND "is_active" = true AND "created_at" >= ?
    GROUP BY DATE("created_at")
    ORDER BY DATE("created_at") ASC
  `,
      [postId, startDate],
    );

    const rawMap = Object.fromEntries(raw.map((r: any) => [r.date, r.count]));

    const dates = Array.from({ length: days }).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const data = dates.map((date) => ({
      date,
      subscriptions: rawMap[date] ?? 0,
    }));

    const totalSubscriptions = data.reduce((sum, d) => sum + d.subscriptions, 0);

    return {
      totalSubscriptions,
      data,
    };
  }
}
