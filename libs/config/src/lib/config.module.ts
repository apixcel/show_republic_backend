import { Module } from '@nestjs/common';
import { ConfigModuleImport } from '@show-republic/validators'; // Adjust the path accordingly
import { ConfigService } from './config.service';

@Module({
  imports: [ConfigModuleImport],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
