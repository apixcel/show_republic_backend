import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from '@show-republic/dtos';
import { UserEntity } from '@show-republic/entities';
import { comparePassword, errorConstants, JwtUtilService } from '@show-republic/utils';

@Injectable()
export class LoginService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly jwtUtilService: JwtUtilService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const em = this.em.fork();
    const userRepo = em.getRepository(UserEntity);
    const user = await userRepo.findOne({ email }, { populate: ['preferences'] });

    if (!user) {
      throw new RpcException(new NotFoundException(errorConstants.USER_NOT_FOUND));
    }
    // Check password validity
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException(new UnauthorizedException(errorConstants.INVALID_CREDENTIALS));
    }

    if (user.preferences?.authenticationType === 'otp') {
      // user has to verify otp
      throw new RpcException(new UnauthorizedException('Account is not verified yet'));
    }
    const payload = { email: user.email, userId: user.id };
    const accessToken = this.jwtUtilService.generateAccessToken(payload);

    return { accessToken };
  }
}
