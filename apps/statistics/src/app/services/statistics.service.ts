import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  AdminEntity,
  AdminStatus,
  BrandEntity,
  ChallengeEntity,
  CreatorEntity,
  UserEntity,
  UserStatus,
} from '@show-republic/entities';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,
    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}
  async adminStatistics() {
    const forkedEm = this.mongoEm.fork();
    const adminRepo = forkedEm.getRepository(AdminEntity);
    const totalAdmin = await adminRepo.count();
    const suspendedAdmins = await adminRepo.count({ status: AdminStatus.SUSPENDED });
    const onLeaveAdmins = await adminRepo.count({ status: AdminStatus.ON_LEAVE });

    return { totalAdmin, suspendedAdmins, onLeaveAdmins };
  }

  async userStatistics() {
    const pgEm = this.pgEm.fork();
    const userRepo = pgEm.getRepository(UserEntity);

    const creatorRepo = pgEm.getRepository(CreatorEntity);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalUsers = await userRepo.count(); // all users
    const dailyActiveUsers = await userRepo.count({
      status: UserStatus.ACTIVE,
      createdAt: { $gte: oneDayAgo },
    });

    const monthlyActiveUsers = await userRepo.count({
      status: UserStatus.ACTIVE,
      createdAt: { $gte: thirtyDaysAgo },
    });

    const userState = {
      totalUsers,
      dailyActiveUsers,
      monthlyActiveUsers,
    };

    // we will do it later
    const brandState = {
      totalBrands: 25,
      dailyActiveBrands: 10,
      monthlyActiveBrands: 90,
    };

    const totalCreators = await creatorRepo.count();

    const dailyCreators = await creatorRepo.count({
      createdAt: { $gte: oneDayAgo },
    });

    const monthlyCreators = await creatorRepo.count({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const creatorState = {
      totalCreators,
      dailyCreators,
      monthlyCreators,
    };

    return { userState, brandState, creatorState };
  }

  async ageGroupStatistics() {
    const forkedEm = this.pgEm.fork();

    const result = await forkedEm.getConnection().execute(`
    SELECT
      CASE
        WHEN age BETWEEN 18 AND 24 THEN '18-24'
        WHEN age BETWEEN 25 AND 34 THEN '25-34'
        WHEN age BETWEEN 35 AND 45 THEN '35-45'
        WHEN age BETWEEN 46 AND 54 THEN '45-54'
        WHEN age BETWEEN 55 AND 64 THEN '55-64'
        WHEN age >= 65 THEN '65+'
        ELSE 'Unknown'
      END AS age_group,
      COUNT(*)::int AS count
    FROM (
      SELECT DATE_PART('year', AGE("date_of_birth")) AS age
      FROM "user_entity"
      WHERE "date_of_birth" IS NOT NULL
    ) AS ages
    GROUP BY age_group
    ORDER BY age_group;
  `);

    const total = result.reduce((sum: any, row: any) => sum + row.count, 0);

    const ageGroups = result.map((row: any) => ({
      group: row.age_group,
      percentage: parseFloat(((row.count / total) * 100).toFixed(2)),
    }));

    return {
      totalUsersWithDOB: total,
      ageGroups,
    };
  }
  async genderStatistics() {
    const forkedEm = this.pgEm.fork();

    const result = await forkedEm.getConnection().execute(`
    SELECT
      gender,
      COUNT(*)::int AS count,
      ROUND(AVG(DATE_PART('year', AGE("date_of_birth"))))::int AS avg_age
    FROM "user_entity"
    WHERE gender IS NOT NULL AND "date_of_birth" IS NOT NULL
    GROUP BY gender
  `);

    const total = result.reduce((sum: any, row: any) => sum + row.count, 0);

    const genderStats = result.map((row: any) => ({
      gender: row.gender,
      percentage: parseFloat(((row.count / total) * 100).toFixed(2)),
      avgAge: row.avg_age,
    }));

    return {
      totalUsersWithGender: total,
      genderStats,
    };
  }

  async accountTypeStatistics() {
    return {
      creatorAccounts: 25,
      brandAccounts: 75,
    };
  }

  async gameficatoinStatistics() {
    const forkedEm = this.mongoEm.fork();
    const challengeRepo = forkedEm.getRepository(ChallengeEntity);
    const totalChallenges = await challengeRepo.count();

    const now = new Date();
    const activeChallenges = await challengeRepo.count({
      endTime: { $gt: now },
      $or: [{ startTime: null }, { startTime: { $lte: now } }],
    });
    const completedChallenges = await challengeRepo.count({ endTime: { $lt: now } });
    return {
      totalChallenges,
      activeChallenges,
      completedChallenges,
    };
  }

  async countryBasedAnalytics() {
    const forkedEm = this.pgEm.fork();

    // Get actual table names dynamically from MikroORM
    const userTable = this.pgEm.getMetadata().get(UserEntity.name).tableName;
    const creatorTable = this.pgEm.getMetadata().get(CreatorEntity.name).tableName;
    const brandTable = this.pgEm.getMetadata().get(BrandEntity.name).tableName;

    // Get user counts by country
    const usersByCountry = await forkedEm.getConnection().execute(`
    SELECT country, COUNT(*)::int as "userCount"
    FROM ${userTable}
    WHERE country IS NOT NULL
    GROUP BY country
  `);

    // Get creator counts by country
    const creatorsByCountry = await forkedEm.getConnection().execute(`
    SELECT country, COUNT(*)::int as "creatorCount"
    FROM ${creatorTable}
    WHERE country IS NOT NULL
    GROUP BY country
  `);

    // Get brand counts by country
    const brandsByCountry = await forkedEm.getConnection().execute(`
    SELECT country, COUNT(*)::int as "brandCount"
    FROM ${brandTable}
    WHERE country IS NOT NULL
    GROUP BY country
  `);

    // Merge the results
    const statsMap = new Map<
      string,
      { country: string; userCount: number; creatorCount: number; brandCount: number }
    >();

    for (const row of usersByCountry) {
      statsMap.set(row.country, {
        country: row.country,
        userCount: row.userCount,
        creatorCount: 0,
        brandCount: 0,
      });
    }

    for (const row of creatorsByCountry) {
      const existing = statsMap.get(row.country);
      if (existing) {
        existing.creatorCount = row.creatorCount;
      } else {
        statsMap.set(row.country, {
          country: row.country,
          userCount: 0,
          creatorCount: row.creatorCount,
          brandCount: 0,
        });
      }
    }

    for (const row of brandsByCountry) {
      const existing = statsMap.get(row.country);
      if (existing) {
        existing.brandCount = row.brandCount;
      } else {
        statsMap.set(row.country, {
          country: row.country,
          userCount: 0,
          creatorCount: 0,
          brandCount: row.brandCount,
        });
      }
    }

    return Array.from(statsMap.values()).sort((a, b) => b.userCount - a.userCount);
  }

  async getUsersByCountry(countryName: string) {
    const forkedEm = this.pgEm.fork() as SqlEntityManager;

    const users = await forkedEm
      .createQueryBuilder(UserEntity, 'u')
      .select(['u.firstName', 'u.lastName', 'u.email', 'u.country', 'u.coverPhoto', 'u.id'])
      .where('LOWER(u.country) = LOWER(?)', [countryName])
      .orderBy({ 'u.lastName': 'asc' })
      .getResult();

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country!,
      coverPhoto: user.coverPhoto || null,
    }));
  }
}
