import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { OtpService, SendEmailService } from '@show-republic/utils';
import { AppController } from './app.controller';
import { ForgotPasswordService } from './services/forgotPassword.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { ResendOtpService } from './services/resendOtp.service';
import { VerifyOtpService } from './services/verifyOtp.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    MikroOrmModule.forFeature([UserEntity], 'postgres'),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_KEY') },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    LoginService,
    RegisterService,
    JWTSTRATEGY,
    OtpService,
    SendEmailService,
    ResendOtpService,
    VerifyOtpService,
    ForgotPasswordService,
  ],
})
export class AuthenticationModule {}
