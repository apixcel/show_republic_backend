import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AdminEntity, UserEntity } from '@show-republic/entities';
import {DatabaseModule,} from '@show-republic/config';
import { AdminUsersController } from './user.controller';
import { AuthService } from './services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ViewUsersService } from './services/ViewUsersService';
import { JWTSTRATEGY } from '@show-republic/guards';

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
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_KEY')  },
      }),
    }),
  ],
  controllers: [AdminUsersController],
  providers: [ViewUsersService, AuthService, JwtService, ConfigService, JWTSTRATEGY, ],
})
export class UserModule {}
