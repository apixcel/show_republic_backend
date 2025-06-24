import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@show-republic/entities';

@Injectable()
export class LoginService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly jwtService: JwtService,
  ) {}
  async forgotPasswordRequest(userEmail: string) {
    const forkedEm = this.em.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const user = await userRepo.findOne({ email: userEmail });
    if (!user) {
      throw new RpcException(
        new NotFoundException(errorConstants.USER_NOT_FOUND),
      );
    }
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
