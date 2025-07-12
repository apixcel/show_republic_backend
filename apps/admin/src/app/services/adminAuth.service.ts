import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ChangePasswordDto, LoginDto } from '@show-republic/dtos';
import { AdminEntity, AdminProfileEntity } from '@show-republic/entities';
import { comparePassword, errorConstants, hashPassword, JwtUtilService } from '@show-republic/utils';

export class AdminAuthService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
    private readonly jwtUtilService: JwtUtilService,
  ) { }
  async login(loginData: LoginDto) {
    const forkedEm = this.em.fork();
    const adminRepo = forkedEm.getRepository(AdminEntity);

    const admin = await adminRepo.findOne({
      email: loginData.email,
    });

    if (!admin) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }

    const isPasswordValid = await comparePassword(loginData.password, admin.password);
    if (!isPasswordValid) {
      throw new RpcException(new UnauthorizedException(errorConstants.INVALID_CREDENTIALS));
    }

    const tokenPayload = { email: admin.email, userId: admin._id.toString(), role: 'admin' };
    const accessToken = this.jwtUtilService.generateAccessToken(tokenPayload);

    return { accessToken };
  }

  async changePassword(adminId: string, changePasswordDto: ChangePasswordDto) {
    const forkedEm = this.em.fork();
    const adminRepo = forkedEm.getRepository(AdminEntity);

    const admin = await adminRepo.findOne({ _id: new ObjectId(adminId) });

    if (!admin) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }

    const isPasswordValid = await comparePassword(changePasswordDto.oldPassword, admin.password);
    if (!isPasswordValid) {
      throw new RpcException(new UnauthorizedException(errorConstants.INVALID_CREDENTIALS));
    }

    admin.password = await hashPassword(changePasswordDto.newPassword);
    await forkedEm.persistAndFlush(admin);
    return true;
  }

  async getAdminProfile(adminId: string) {
    const forkedEm = this.em.fork();
    const adminRepo = forkedEm.getRepository(AdminEntity);
    const admin = await adminRepo.findOne({ _id: new ObjectId(adminId) });

    if (!admin) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }

    const adminProfile = await forkedEm.findOne(AdminProfileEntity, { admin: admin._id.toString() });

    return adminProfile;
  }
}
