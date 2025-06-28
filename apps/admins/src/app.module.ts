import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@show-republic/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AdminEntity } from '@show-republic/entities';
import { AdminUsersController } from './User/user.controller';
import { AuthService } from './User/services/auth.service';
import { ViewUsersService } from './User/services/ViewUsersService';
// import { JwtUtilService } from '@show-republic/utils';
import { ConfigService } from '@nestjs/config';
import { JWTSTRATEGY } from '@show-republic/guards';


@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature([AdminEntity], 'mongo'),
    JwtModule
  ],
  controllers: [AdminUsersController],
  // providers: [AuthService, ViewUsersService, JwtUtilService],
  providers: [ViewUsersService, AuthService, JwtService, ConfigService, JWTSTRATEGY],
})
export class AppModule { }
