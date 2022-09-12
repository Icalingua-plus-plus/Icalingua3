import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import Message from './entities/Message.js';
import { sqliteMigrationPath, sqliteDbPath } from '../utils/pathUtils.js';
import logger from '../utils/logger.js';
import ChatRoom from './entities/ChatRoom.js';

const config: Options = {
  entities: [Message, ChatRoom],
  dbName: sqliteDbPath,
  type: 'better-sqlite',
  useBatchInserts: true,
  batchSize: 256,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: 'migrations',
    path: sqliteMigrationPath,
  },
  debug: ['discovery', 'info'],
  /** 让 Winston 输出 */
  logger: (msg) => logger.debug(msg),
};

export default config;
