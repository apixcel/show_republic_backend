import { EntityManager } from '@mikro-orm/core';
import { MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { AdminProfileDto, SendAdminInvitationDto } from '@show-republic/dtos';
import { AdminEntity, AdminInvitatonEntity, AdminProfileEntity, AdminStatus } from '@show-republic/entities';
import { hashPassword, SendEmailService } from '@show-republic/utils';

export class AdminManagementService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
    private readonly sendEmailService: SendEmailService,
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

  async getAdminProfileByAdminId(adminId: string) {
    const forkedEm = this.em.fork();
    const adminProfileRepo = forkedEm.getRepository(AdminProfileEntity);
    const adminProfile = await adminProfileRepo.findOne({ admin: adminId });
    return adminProfile;
  }

  async sendInvitationLink(EmtailsDto: SendAdminInvitationDto) {
    const forkedEm = this.em.fork();
    const invitationrepo = forkedEm.getRepository(AdminInvitatonEntity);
    const emails = EmtailsDto.emails;
    const totday = new Date();
    const expiresAt = new Date(totday.setDate(totday.getDate() + 3)); // 3 day from now

    for (const email of emails) {
      let invitation = await invitationrepo.findOne({ email });

      if (invitation) {
        invitation.expiresAt = expiresAt;
      } else {
        invitation = invitationrepo.create({ email, expiresAt });
        await forkedEm.persistAndFlush(invitation);
      }
      await this.sendEmailService.sendMail({
        html: `<p>You have a invitation to join as admin. this invitation will be valid for 3 days. Click <a href="https://showrepublicadmin.apixcel.com/signup/${invitation._id}">here</a> confirm invitation</p>`,
        to: email,
        subject: 'Admin invitation',
      });
    }

    return true;
  }
  async createAdminProfileByInvitationToken(adminProfileDto: AdminProfileDto, token: string) {
    const forkedEm = this.em.fork();
    const adminProfileRepo = forkedEm.getRepository(AdminProfileEntity);
    const adminRepo = forkedEm.getRepository(AdminEntity);
    const invitationRepo = forkedEm.getRepository(AdminInvitatonEntity);

    const isInvited = await invitationRepo.findOne({ _id: new ObjectId(token) });

    if (!isInvited) {
      throw new RpcException('Invitation not found');
    }

    if (isInvited.expiresAt < new Date()) {
      throw new RpcException('Invitation expired');
    }

    const isAdminExist = await adminRepo.findOne({ email: isInvited.email });

    if (isAdminExist) {
      throw new RpcException('Admin already exists with this email');
    }

    const hashedPassword = await hashPassword(adminProfileDto.password);

    const admin = adminRepo.create({
      email: isInvited.email,
      firstName: adminProfileDto.fullName.split(' ')[0] || '',
      lastName: adminProfileDto.fullName.split(' ')[1] || '',
      role: 'admin',
      image: '',
      password: hashedPassword,
      phone: adminProfileDto.phoneNumber,
      status: AdminStatus.ACTIVE,
      username: adminProfileDto.username,
    });
    await forkedEm.persistAndFlush(admin);

    const adminProfile = adminProfileRepo.create({ ...adminProfileDto, admin });
    adminProfile.admin = admin;
    await forkedEm.persistAndFlush(adminProfile);
    await forkedEm.removeAndFlush(isInvited);
    return adminProfile;
  }
}
