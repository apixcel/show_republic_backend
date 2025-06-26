import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { GoogleStrategy } from '@show-republic/oauthStrategy';
import { JwtUtilService, OtpService, SendEmailService, SetCookieUtilService } from '@show-republic/utils';
import { AppController } from './app.controller';
import { ForgotPasswordService } from './services/forgotPassword.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { ResendOtpService } from './services/resendOtp.service';
import { SocialLoginService } from './services/socialLogin.service';
import { VerifyOtpService } from './services/verifyOtp.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    LoginService,
    RegisterService,
    SocialLoginService,
    GoogleStrategy,
    JWTSTRATEGY,
    JwtUtilService,
    OtpService,
    SendEmailService,
    ResendOtpService,
    VerifyOtpService,
    SetCookieUtilService,
    ForgotPasswordService,
  ],
})
export class AppModule {}
