import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  ChangePasswordDto,
  ForogotPasswordRequestDto,
  LoginDto,
  resendOtpDto,
  ResetPasswordDto,
  UserDto,
  VerifyOtpDto,
} from '@show-republic/dtos';
import { SetCookieUtilService } from '@show-republic/utils';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private setCookieUtilService: SetCookieUtilService,
  ) {}

  // *****login*******
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_login' }, loginData));
    return order;
  }
  @Post('register')
  async register(@Body() registerData: UserDto) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_register' }, registerData));
    return order;
  }
  @Post('resend-otp')
  async resendOtp(@Body() resendOtpData: resendOtpDto) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_otp_resend' }, resendOtpData));
    return order;
  }
  @Post('verify-otp')
  async verrifyOtp(@Body() verifyOtpData: VerifyOtpDto) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_otp_verify' }, verifyOtpData));
    return order;
  }
  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() payload: ChangePasswordDto, @Req() req: any) {
    const userId = req.user?.userId;
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_change_password' }, { userId, payload }));
    return order;
  }
  @Post('forgot-password')
  async forgotPasswordRequest(@Body() forgotPasswordData: ForogotPasswordRequestDto) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_req_forgot_password' }, forgotPasswordData));
    return order;
  }
  @Put('reset-password')
  async resetPassword(@Body() resetPasswordData: ResetPasswordDto) {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_req_reset_password' }, resetPasswordData));
    return order;
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: any) {
    const currentUserId = req.user?.userId;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const user = await lastValueFrom(this.natsClient.send({ cmd: 'user_profile' }, { currentUserId }));
    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google OAuth
  }

  // *****Signup*******
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOauthCallBack(@Request() req: any, @Res() res: any) {
    const user = req.user;
    const order = (await lastValueFrom(this.natsClient.send({ cmd: 'auth_oauth_google_callback' }, user))) as {
      accessToken: string;
      refreshToken: string;
    };

    this.setCookieUtilService.setCookie({ res: res, token: order.refreshToken, cookieName: 'refreshToken' });
    return res.redirect(`https://apixrec.apixcel.com?token=${order.accessToken}`);
  }
  @Get('test')
  async signUp() {
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'auth_test' }, {}));
    return order;
  }
}
