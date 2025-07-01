import { EntityManager } from '@mikro-orm/core';
import { MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { AdminProfileDto } from '@show-republic/dtos';
import { AdminEntity, AdminProfileEntity } from '@show-republic/entities';

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

    if (query.role) {
      queryFilter.role = query.role;
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

  async countAdminsByRole() {
    const mongoEm = this.em as MongoEntityManager;
    const db = mongoEm.getConnection().getClient().db(); // Native MongoDB `Db` object
    const collection = db.collection('admin-entity');

    const result = await collection
      .aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    return result.map((item) => ({
      role: item._id,
      count: item.count,
    }));
  }

  async createAdminProfile(adminProfileDto: AdminProfileDto) {
    const forkedEm = this.em.fork();
    const adminProfileRepo = forkedEm.getRepository(AdminProfileEntity);
    const adminRepo = forkedEm.getRepository(AdminEntity);

    const isAdminExits = await adminRepo.findOne({ _id: new ObjectId(adminProfileDto.admin) });

    if (!isAdminExits) {
      throw new RpcException('Admin not found');
    }

    const adminProfile = adminProfileRepo.create({ ...adminProfileDto, admin: isAdminExits });
    adminProfile.admin = isAdminExits;
    await forkedEm.persistAndFlush(adminProfile);
    return adminProfile;
  }

  async getAdminProfileByAdminId(adminId: string) {
    const forkedEm = this.em.fork();
    const adminProfileRepo = forkedEm.getRepository(AdminProfileEntity);
    const adminProfile = await adminProfileRepo.findOne({ admin: adminId });
    return adminProfile;
  }
}
