import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { PermissionEntity, RoleEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { NotificationService } from './services/notificationService';

@Module({
  imports: [DatabaseModule, MikroOrmModule.forFeature([RoleEntity, PermissionEntity], 'mongo')],
  controllers: [AppController],
  providers: [NotificationService],
})
export class AppModule { }
