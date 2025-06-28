import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@show-republic/config';
import { AdminEntity, UserEntity } from '@show-republic/entities';
import { JWTSTRATEGY } from '@show-republic/guards';
import { AuthService } from './services/auth.service';
import { ViewUsersService } from './services/ViewUsersService';
import { AdminUsersController } from './user.controller';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([AdminEntity], 'mongo'),
    MikroOrmModule.forFeature([UserEntity], 'postgres'),

    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_KEY') },
      }),
    }),
  ],
  controllers: [AdminUsersController],
  providers: [ViewUsersService, AuthService, JwtService, ConfigService, JWTSTRATEGY],
})
export class UserModule {}
