import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@show-republic/entities';
import { JwtUtilService } from '@show-republic/utils';

@Injectable()
export class SocialLoginService {
  constructor(
    private readonly jwtUtilService: JwtUtilService,
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,
    private configService: ConfigService,
  ) {}
  async googleAuthCallBack(user: { email: string; name: string }) {
    const payload = {
      email: user.email as string,
      name: user.name as string,
    };

    const em = this.em.fork();
    const userRepo = em.getRepository(UserEntity);
    const existingUser = await userRepo.findOne({ email: payload.email });

    if (existingUser) {
      const tokenPayload = { email: existingUser.email, userId: existingUser.id };
      const accessToken = this.jwtUtilService.generateAccessToken(tokenPayload);
      const refreshToken = this.jwtUtilService.generateRefreshToken(tokenPayload);

      return { accessToken, refreshToken };
    }

    const newUser = em.create(UserEntity, {
      ...payload,
      firstName: payload.name.split(' ')[0],
      lastName: payload.name.split(' ')[1] || '',
      password: '',
    });

    await em.persistAndFlush(newUser);
    const tokenPayload = { email: newUser.email, userId: newUser.id };
    console.log(tokenPayload, 'tokenPayload');

    const accessToken = this.jwtUtilService.generateAccessToken(tokenPayload);
    const refreshToken = this.jwtUtilService.generateRefreshToken(tokenPayload);
    return { accessToken, refreshToken };
  }
}
