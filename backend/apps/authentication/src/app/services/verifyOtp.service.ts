import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { VerifyOtpDto } from '@show-republic/dtos';
import { UserPreferencesEntity } from '@show-republic/entities';
import { AuthenticationType } from '@show-republic/types';
import { errorConstants } from '@show-republic/utils';

export class VerifyOtpService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly jwtService: JwtService,
  ) {}
  async verify(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    const forkedEm = this.em.fork();

    // Find user preferences by email directly and select necessary fields
    const userPreferences = await forkedEm
      .getRepository(UserPreferencesEntity)
      .findOne(
        { user: { email: verifyOtpDto.email } },
        { fields: ['secret', 'otpExpiry', 'authenticationType', 'user'] }, // Include authenticationType here
      );

    // Check if user preferences are found
    if (!userPreferences) {
      throw new RpcException(
        new BadRequestException(errorConstants.USER_NOT_FOUND),
      );
    }

    const { secret, otpExpiry, user } = userPreferences;
    const currentTime = new Date();

    // Check OTP expiration
    if (otpExpiry && currentTime > otpExpiry) {
      throw new RpcException(
        new BadRequestException(errorConstants.OTP_EXPIRED),
      );
    }

    // Validate OTP secret
    if (verifyOtpDto.secret !== secret) {
      throw new RpcException(
        new BadRequestException(errorConstants.INVALID_OTP),
      );
    }

    // Clear OTP-related fields and update authentication type
    userPreferences.secret = null;
    userPreferences.otpExpiry = null;
    userPreferences.authenticationType = AuthenticationType.EMAIL;

    // Save changes within the forked context (transaction)
    await forkedEm.flush();

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    // Return the access token
    return { accessToken };
  }
}
