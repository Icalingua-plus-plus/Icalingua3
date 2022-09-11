import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Message } from './entities/Message.js';
import { sqliteMigrationPath, sqliteDbPath } from '../utils/pathUtils.js';

const config: Options = {
  entities: [Message],
  dbName: sqliteDbPath,
  type: 'better-sqlite',
  useBatchInserts: true,
  batchSize: 256,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: 'migrations',
    path: sqliteMigrationPath,
  },
};

export default config;
