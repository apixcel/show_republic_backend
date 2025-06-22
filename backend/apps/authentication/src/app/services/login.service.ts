import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { LoginDto } from '@show-republic/dtos';
import { UserEntity } from '@show-republic/entities';
import { comparePassword, errorConstants } from '@show-republic/utils';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity, 'postgres')
    private readonly userRepository: EntityRepository<UserEntity>,

    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const em = this.em.fork();
    const userRepo = em.getRepository(UserEntity);
    const user = await userRepo.findOne(
      { email },
      { populate: ['preferences'] },
    );

    if (!user) {
      throw new RpcException(
        new NotFoundException(errorConstants.USER_NOT_FOUND),
      );
    }
    // Check password validity
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException(
        new UnauthorizedException(errorConstants.INVALID_CREDENTIALS),
      );
    }

    if (user.preferences?.authenticationType === 'otp') {
      // user has to verify otp
      throw new RpcException(
        new UnauthorizedException('Account is not verified yet'),
      );
    }
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
