import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { UserDto, UserPreferencesDto } from '@show-republic/dtos';
import { UserEntity, UserPreferencesEntity, UserRole, UserStatus } from '@show-republic/entities';
import { errorConstants, hashPassword, OtpService } from '@show-republic/utils';
import Stripe from 'stripe';
@Injectable()
export class RegisterService {
  private stripe: Stripe;
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,
    private configService: ConfigService,
    private readonly otpService: OtpService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SK')!, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async register(userData: UserDto, userPreferencesDto: UserPreferencesDto): Promise<null> {
    const forkedEm = this.em.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const existingUser = await userRepo.findOne({ email: userData.email });
    if (existingUser) {
      throw new RpcException(new ConflictException(errorConstants.EMAIL_IN_USE));
    }
    const hashedPassword = await hashPassword(userData.password);

    const customer = await this.stripe.customers.create({
      name: userData.firstName + ' ' + userData.lastName,
      email: userData.email,
    });

    const user = userRepo.create({
      ...userData,
      status: UserStatus.ACTIVE,
      roles: [UserRole.USER],
      password: hashedPassword,
    }); // Create user preferences entity
    const userPreferences = forkedEm.create(UserPreferencesEntity, {
      ...userPreferencesDto,
      user,
    });

    // Set OTP secret and expiry if not already set
    if (!userPreferences.secret) {
      const { otp } = await this.otpService.customOtpGen(userData.email, userData.firstName);
      userPreferences.secret = otp;
    }
    if (!userPreferences.otpExpiry) {
      const { expiry } = await this.otpService.customexpiry();
      userPreferences.otpExpiry = expiry;
    }

    // Associate preferences with user
    user.preferences = userPreferences;
    await forkedEm.persistAndFlush([user, userPreferences]);
    return null;
  }
}
