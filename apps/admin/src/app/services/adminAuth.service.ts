import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from '@show-republic/dtos';
import { AdminEntity } from '@show-republic/entities';
import { comparePassword, errorConstants, JwtUtilService } from '@show-republic/utils';

export class AdminAuthService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
    private readonly jwtUtilService: JwtUtilService,
  ) {}
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

    const tokenPayload = { email: admin.email, userId: admin._id.toString() };
    const accessToken = this.jwtUtilService.generateAccessToken(tokenPayload);

    return { accessToken };
  }
}
