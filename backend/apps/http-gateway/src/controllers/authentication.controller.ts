import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  ForogotPasswordRequestDto,
  LoginDto,
  resendOtpDto,
  ResetPasswordDto,
  UserDto,
  VerifyOtpDto,
} from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthenticationController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // *****login*******
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_login' }, loginData),
    );
    return order;
  }
  @Post('register')
  async register(@Body() registerData: UserDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_register' }, registerData),
    );
    return order;
  }
  @Post('resend-otp')
  async resendOtp(@Body() resendOtpData: resendOtpDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_otp_resend' }, resendOtpData),
    );
    return order;
  }
  @Post('verify-otp')
  async verrifyOtp(@Body() verifyOtpData: VerifyOtpDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_otp_verify' }, verifyOtpData),
    );
    return order;
  }
  @Post('forgot-password')
  async forgotPasswordRequest(
    @Body() forgotPasswordData: ForogotPasswordRequestDto,
  ) {
    const order = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'auth_req_forgot_password' },
        forgotPasswordData,
      ),
    );
    return order;
  }
  @Put('reset-password')
  async resetPassword(@Body() resetPasswordData: ResetPasswordDto) {
    const order = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'auth_req_reset_password' },
        resetPasswordData,
      ),
    );
    return order;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google OAuth
  }

  // *****Signup*******
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOauthCallBack(@Request() req: any) {
    const order = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'auth_oauth_google_callback' },
        { email: req.user.email, name: req.user.name },
      ),
    );
    return order;
  }
  @Get('test')
  async signUp() {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_test' }, {}),
    );
    return order;
  }
}
