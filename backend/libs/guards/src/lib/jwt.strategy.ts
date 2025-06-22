import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

@Injectable()
export class JWTSTRATEGY extends PassportStrategy(JwtStrategy) {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserEntity, 'postgres')
    private readonly userRepository: EntityRepository<UserEntity>,

    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,
  ) {
    super({
      // @
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Ensure expiration is respected
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')!, // Use the same secret used for signing JWT
    });
  }

  /**
   * Validate the JWT payload and ensure the associated user exists.
   */
  async validate(payload: any) {
    const forkedEm = this.em.fork(); // Use a scoped EntityManager for the current request

    // console.log(payload,'payloaddddddddddd')
    try {
      // Validate that the user exists
      const user = await forkedEm.findOne(UserEntity, { id: payload.sub });
      if (!user) {
        throw new NotFoundException(errorConstants.USER_NOT_FOUND);
      }

      // Return relevant user information for downstream use
      return { userId: payload.sub };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(errorConstants.TOKEN_EXPIRED);
      }
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException(errorConstants.INVALID_TOKEN);
      }
      throw new UnauthorizedException(errorConstants.UNAUTHORIZED);
    }
  }
}
