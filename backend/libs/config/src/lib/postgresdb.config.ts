import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/postgresql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { PlaylistEntity, UserEntity, UserPreferencesEntity } from '@show-republic/entities'
import path from 'path';

const PostgresdbConfig = defineConfig({
  host: 'postgresdb',  
  port: 5432,
  user: 'postgres',
  password: 'qubitars',
  dbName: 'demo',
  driver: PostgreSqlDriver,
  entities: [UserEntity,UserPreferencesEntity,PlaylistEntity],  // Ensure compiled JS files are referenced
  debug: true,
  highlighter: new SqlHighlighter(),
  metadataProvider: ReflectMetadataProvider,
  tsNode: true,

  migrations: {
    path: path.resolve(__dirname, './database/migrations'),
    pathTs: path.resolve(__dirname, './database/migrations'),
    glob: '!(*.d).{js,ts}',
  },

  extensions: [Migrator, EntityGenerator, SeedManager],
  logger: (message) => {
    if (message.includes('Connected to database')) {
      console.log('Successfully connected to PostgreSQL');
    }
  },
});
export default PostgresdbConfig ; // Export the config for use in the module