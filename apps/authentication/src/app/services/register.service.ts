import { EntityManager } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserDto, UserPreferencesDto } from '@show-republic/dtos';
import { UserEntity, UserPreferencesEntity, UserStatus } from '@show-republic/entities';
import { errorConstants, hashPassword, OtpService } from '@show-republic/utils';
@Injectable()
export class RegisterService {
  constructor(
    @InjectEntityManager('postgres') // Inject the 'postgres' EntityManager
    private readonly em: EntityManager,

    private readonly otpService: OtpService,
  ) {}

  async register(userData: UserDto, userPreferencesDto: UserPreferencesDto): Promise<null> {
    const forkedEm = this.em.fork();
    const userRepo = forkedEm.getRepository(UserEntity);
    const existingUser = await userRepo.findOne({ email: userData.email });
    if (existingUser) {
      throw new RpcException(new ConflictException(errorConstants.EMAIL_IN_USE));
    }
    const hashedPassword = await hashPassword(userData.password);
    const user = userRepo.create({
      ...userData,
      status: UserStatus.ACTIVE,
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
