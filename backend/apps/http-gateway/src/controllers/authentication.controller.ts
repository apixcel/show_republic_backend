import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  LoginDto,
  resendOtpDto,
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
      this.natsClient.send({ cmd: 'auth_login' }, loginData), // Ensure command name matches
    );
    return order;
  }
  @Post('register')
  async register(@Body() registerData: UserDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_register' }, registerData), // Ensure command name matches
    );
    return order;
  }
  @Post('resend-otp')
  async resendOtp(@Body() resendOtpData: resendOtpDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_otp_resend' }, resendOtpData), // Ensure command name matches
    );
    return order;
  }
  @Post('verify-otp')
  async verrifyOtp(@Body() verifyOtpData: VerifyOtpDto) {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_otp_verify' }, verifyOtpData), // Ensure command name matches
    );
    return order;
  }

  // *****Signup*******
  @Get('test')
  async signUp() {
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_test' }, {}),
    );
    return order;
  }
}
