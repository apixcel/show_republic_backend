import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ForogotPasswordRequestDto,
  LoginDto,
  resendOtpDto,
  ResetPasswordDto,
  UserDto,
  UserPreferencesDto,
  VerifyOtpDto,
} from '@show-republic/dtos';
import { ForgotPasswordService } from './services/forgotPassword.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { ResendOtpService } from './services/resendOtp.service';
import { VerifyOtpService } from './services/verifyOtp.service';

@Controller()
export class AppController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly resendOtpService: ResendOtpService,
    private readonly verifyOtpService: VerifyOtpService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @MessagePattern({ cmd: 'auth_login' })
  login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.loginService.login(loginDto);
  }

  @MessagePattern({ cmd: 'auth_register' })
  register({
    preferences,
    ...userDto
  }: UserDto & { preferences: UserPreferencesDto }): Promise<null> {
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

  @MessagePattern({ cmd: 'auth_test' })
  test(): string {
    return 'Hello World!';
  }
}
