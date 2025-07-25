import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@show-republic/config';
import { AdminEntity } from '@show-republic/entities';
import { JwtUtilService, SendEmailService } from '@show-republic/utils';
import { NotificationUtilService } from 'libs/utils/src/lib/notification.util';
import { AppController } from './app.controller';
import { AdminAuthService } from './services/adminAuth.service';
import { AdminManagementService } from './services/adminManageMent.service';
import { AdminNotificatonService } from './services/adminNotification.service';
import { RolePermissionService } from './services/rolePermission.service';
import { UserManagementService } from './services/userManagement.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forFeature([AdminEntity], 'mongo'),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AppController],
  providers: [
    AdminAuthService,
    UserManagementService,
    AdminManagementService,
    RolePermissionService,
    AdminNotificatonService,
    JwtUtilService,
    JwtService,
    NotificationUtilService,
    SendEmailService,
  ],
})
export class AppModule {}
