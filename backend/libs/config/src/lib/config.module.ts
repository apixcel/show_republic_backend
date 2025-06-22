import { Module } from '@nestjs/common';
import { ConfigModuleImport } from '@show-republic/validators'; // Adjust the path accordingly
import { ConfigService } from './config.service';
// import { MikroOrmModule } from '@mikro-orm/nestjs';
// import  PostgresdbConfig from './postgresdb.config';
// import  MongodbConfig from './mongodb.config';

@Module({
  imports: [ConfigModuleImport],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
