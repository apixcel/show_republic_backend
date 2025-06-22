import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@show-republic/config';
import { UserEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { LoginService } from './services/login.service';

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
  providers: [LoginService],
})
export class AuthenticationModule {}
