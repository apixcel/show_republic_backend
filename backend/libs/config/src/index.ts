export * from './lib/config.module';
export * from './lib/config.service';
export * from './lib/database.module';
export { default as PostgresdbConfig } from './lib/postgresdb.config'; // Ensure you use default export
export { default as MongodbConfig } from './lib/mongodb.config';
export  *  from './lib/s3.config';