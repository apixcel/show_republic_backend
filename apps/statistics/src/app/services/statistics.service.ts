import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AdminEntity, AdminStatus, CreatorEntity, UserEntity, UserStatus } from '@show-republic/entities';

export class StatisticsService {
  constructor(
    @InjectRepository('mongo')
    private readonly em: EntityManager,
  ) {}
  async adminStatistics() {
    const forkedEm = this.em.fork();
    const adminRepo = forkedEm.getRepository(AdminEntity);
    const totalAdmin = await adminRepo.count();
    const suspendedAdmins = await adminRepo.count({ status: AdminStatus.SUSPENDED });
    const onLeaveAdmins = await adminRepo.count({ status: AdminStatus.ON_LEAVE });

    return { totalAdmin, suspendedAdmins, onLeaveAdmins };
  }

  async userStatistics() {
    const forkedEm = this.em.fork();
    const userRepo = forkedEm.getRepository(UserEntity);

    const creatorRepo = forkedEm.getRepository(CreatorEntity);

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
    const forkedEm = this.em.fork();

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
      SELECT DATE_PART('year', AGE("dateOfBirth")) AS age
      FROM "user_entity"
      WHERE "dateOfBirth" IS NOT NULL
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
    const forkedEm = this.em.fork();

    const result = await forkedEm.getConnection().execute(`
    SELECT
      gender,
      COUNT(*)::int AS count,
      ROUND(AVG(DATE_PART('year', AGE("dateOfBirth"))))::int AS avg_age
    FROM "user_entity"
    WHERE gender IS NOT NULL AND "dateOfBirth" IS NOT NULL
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
}
