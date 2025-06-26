import { Injectable, ConflictException, NotFoundException, UnauthorizedException, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  RequiredEntityData,
} from '@mikro-orm/core';
import { AdminEntity } from '@show-republic/entities';
import { comparePassword, errorConstants, hashPassword } from '@show-republic/utils';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Ensure this package is installed
// import { AdminDto, AdminStatus } from 'libs/dtos/src/lib/AdminDto.dto';

import { ConfigService } from '@nestjs/config';
import { AdminDto, AdminStatus } from '@show-republic/dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity, 'mongo')
    private readonly adminRepository: EntityRepository<AdminEntity>,

    @InjectEntityManager('mongo') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly jwtService: JwtService,
    private configService: ConfigService

  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY');
    Logger.log(`JWT_SECRET: ${jwtSecret}`);
  }

  async signup(adminDto: AdminDto,): Promise<any> {


    const forkedEm = this.em.fork();
    const adminRepo = forkedEm.getRepository(AdminEntity);

    // Check if email already exists
    const existingUser = await adminRepo.findOne({ email: adminDto.email });
    if (existingUser) {
      throw new RpcException(
        new ConflictException(errorConstants.EMAIL_IN_USE)
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(adminDto.password);

    // Create user entity
    const user = forkedEm.create(AdminEntity, {
      ...adminDto,
      password: hashedPassword,
      userId: uuidv4(),
      status: AdminStatus.ACTIVE
    });

    // Persist user and preferences in one transaction
    await forkedEm.persistAndFlush([user]);

    return true;

  }

  async login(loginDto: any): Promise<{ accessToken: string }> {
    try {
      const forkedEm = this.em.fork();

      // Fetch user with preferences using email
      const user = await forkedEm
        .getRepository(AdminEntity)
        .findOne({ email: loginDto.email });

      // Validate user existence
      if (!user) {
        throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
      }

      // Check password validity
      const isPasswordValid = await comparePassword(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new RpcException(new UnauthorizedException(errorConstants.INVALID_CREDENTIALS));
      }

      // Generate JWT access token
      const payload = { email: user.email, sub: user._id };

      const secret = this.configService.get<string>('JWT_SECRET_KEY');
      const accessToken = jwt.sign(payload, secret!, {
        expiresIn: '24h',
      });

      return { accessToken };
    } catch (error: any) {


      throw new RpcException(new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      ))
    }
  }
}
