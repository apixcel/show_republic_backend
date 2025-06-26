import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import MongodbConfig from './mongodb.config';
import PostgresdbConfig from './postgresdb.config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...MongodbConfig,
      contextName: 'mongo',
      registerRequestContext: false,
    }),
    MikroOrmModule.forRoot({
      ...PostgresdbConfig,
      contextName: 'postgres',
      registerRequestContext: false,
    }),
    MikroOrmModule, // ✅ Explicitly import base module
  ],
  exports: [MikroOrmModule], // ✅ Now it's valid to export
})
export class DatabaseModule {}
