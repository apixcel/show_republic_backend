import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@show-republic/config';
import { PermissionEntity, RoleEntity } from '@show-republic/entities';
import { AppController } from './app.controller';
import { SettingsService } from './services/settingsService';

@Module({
  imports: [DatabaseModule, MikroOrmModule.forFeature([RoleEntity, PermissionEntity], 'mongo')],
  controllers: [AppController],
  providers: [SettingsService],
})
export class AppModule { }
