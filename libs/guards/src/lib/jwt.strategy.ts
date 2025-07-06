import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AdminEntity, UserEntity } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

@Injectable()
export class JWTSTRATEGY extends PassportStrategy(JwtStrategy) {
  constructor(
    private readonly configService: ConfigService,

    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly pgEm: EntityManager,
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Ensure expiration is respected
      secretOrKey: configService.get<string>('JWT_SECRET_KEY') || 'secret', // Use the same secret used for signing JWT
    });
  }

  /**
   * Validate the JWT payload and ensure the associated user exists.
   */
  async validate(payload: any) {
    // console.log(payload,'payloaddddddddddd')
    try {
      if (payload.role == 'user') {
        const forkedEm = this.pgEm.fork(); // Use a scoped EntityManager for the current request
        // Validate that the user exists
        const user = await forkedEm.findOne(UserEntity, { id: payload.userId });
        if (!user) {
          throw new NotFoundException(errorConstants.USER_NOT_FOUND);
        }

        return { userId: payload.userId };
      } else {
        const forkedEm = this.mongoEm.fork(); // Use a scoped EntityManager for the current request
        // Validate that the user exists
        const user = await forkedEm.findOne(AdminEntity, { _id: payload.userId });
        if (!user) {
          throw new NotFoundException(errorConstants.USER_NOT_FOUND);
        }

        return { userId: user._id };
      }
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
