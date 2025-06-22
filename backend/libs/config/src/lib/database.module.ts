import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
// import PostgresdbConfig from './postgresdb.config';
import MongodbConfig from './mongodb.config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...MongodbConfig, // MongoDB configuration
      contextName: 'mongo', // Name context as 'mongo'
      registerRequestContext: false,
    }),

    // MikroOrmModule.forRoot({
    //   ...PostgresdbConfig,
    //   contextName: 'postgres',
    //   registerRequestContext: false, // Enable request context for scoped repositories
    // }),
  ],
  exports: [MikroOrmModule], // Export MikroORM for reuse
})
export class DatabaseModule {}
