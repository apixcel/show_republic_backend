import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  ChangePasswordDto,
  ForogotPasswordRequestDto,
  LoginDto,
  resendOtpDto,
  ResetPasswordDto,
  UserDto,
  UserPreferencesDto,
  VerifyOtpDto,
} from '@show-republic/dtos';
import { PasswordService } from './services/Password.service';
import { LoginService } from './services/login.service';
import { GetProfileService } from './services/profile.service';
import { RegisterService } from './services/register.service';
import { ResendOtpService } from './services/resendOtp.service';
import { SocialLoginService } from './services/socialLogin.service';
import { VerifyOtpService } from './services/verifyOtp.service';

@Controller()
export class AppController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly resendOtpService: ResendOtpService,
    private readonly verifyOtpService: VerifyOtpService,
    private readonly forgotPasswordService: PasswordService,
    private readonly socialLoginService: SocialLoginService,
    private readonly getProfileService: GetProfileService,
  ) {}

  @MessagePattern({ cmd: 'auth_login' })
  login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.loginService.login(loginDto);
  }

  @MessagePattern({ cmd: 'auth_register' })
  register({ preferences, ...userDto }: UserDto & { preferences: UserPreferencesDto }): Promise<null> {
    return this.registerService.register(userDto, preferences);
  }
  @MessagePattern({ cmd: 'auth_otp_resend' })
  resendOtp(resendOtpDto: resendOtpDto): Promise<boolean> {
    return this.resendOtpService.resend(resendOtpDto);
  }
  @MessagePattern({ cmd: 'auth_otp_verify' })
  verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    return this.verifyOtpService.verify(verifyOtpDto);
  }
  @MessagePattern({ cmd: 'auth_req_forgot_password' })
  forgotPasswordRequest(payload: ForogotPasswordRequestDto) {
    return this.forgotPasswordService.forgotPasswordRequest(payload.email);
  }
  @MessagePattern({ cmd: 'auth_req_reset_password' })
  resetPassword(payload: ResetPasswordDto) {
    return this.forgotPasswordService.resetPassword(payload);
  }
  @MessagePattern({ cmd: 'auth_change_password' })
  changePassword({ userId, payload }: { userId: string; payload: ChangePasswordDto }) {
    return this.forgotPasswordService.changePassword(userId, payload);
  }
  @MessagePattern({ cmd: 'auth_oauth_google_callback' })
  googleOauthCallBack(user: { email: string; name: string }) {
    return this.socialLoginService.googleAuthCallBack(user);
  }

  @MessagePattern({ cmd: 'user_profile' })
  async profile(@Payload() data: { currentUserId: string }): Promise<any> {
    const userId = data?.currentUserId;

    if (!userId) {
      throw new RpcException('User ID is required');
    }

    const user = await this.getProfileService.profile(userId);

    return user;
  }
}
