import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { resendOtpDto } from '@show-republic/dtos';
import { UserEntity, UserPreferencesEntity } from '@show-republic/entities';
import { errorConstants, OtpService } from '@show-republic/utils';

@Injectable()
export class ResendOtpService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly otpService: OtpService,
  ) {}
  async resend(resendOtpDto: resendOtpDto): Promise<boolean> {
    const forkedEm = this.em.fork();

    // Fetch user preferences using email
    const userPreferences = await forkedEm
      .getRepository(UserPreferencesEntity)
      .findOne({ user: { email: resendOtpDto.email } });

    if (!userPreferences) {
      throw new RpcException(errorConstants.INVALID_EMAIL);
    }

    const expiryDate = userPreferences.otpExpiry;
    const currentDate = new Date();
    console.log('expiryDate (raw):', expiryDate);
    // console.log('expiryDate (parsed):', new Date(expiryDate));
    console.log('currentDate:', currentDate);

    if (expiryDate && new Date(expiryDate) > currentDate) {
      const remainingMs =
        new Date(expiryDate).getTime() - currentDate.getTime();
      const secondsLeft = Math.max(0, Math.floor(remainingMs / 1000));

      throw new RpcException({
        message: `OTP hasn't expired yet. Retry after ${secondsLeft} seconds. Expired at ${expiryDate.toISOString()}.`,
        data: {
          expiryDate: expiryDate,
          secondsLeft: secondsLeft,
        },
      });
    }

    const user = await forkedEm
      .getRepository(UserEntity)
      .findOne({ email: resendOtpDto.email });
    if (!user) {
      throw new RpcException(errorConstants.INVALID_EMAIL);
    }
    // Generate OTP and expiry
    const { otp } = await this.otpService.customOtpGen(
      resendOtpDto.email,
      user.firstName,
    );

    const { expiry } = await this.otpService.customexpiry();

    // Update user preferences with new OTP and expiry values

    userPreferences.secret = otp;
    userPreferences.otpExpiry = expiry;

    // Persist the updated preferences in a transaction
    await forkedEm.persistAndFlush(userPreferences);

    return true;
  }
}
