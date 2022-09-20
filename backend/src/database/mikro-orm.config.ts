import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import logger from '../utils/logger.js';
import { sqliteDbPath, sqliteMigrationPath } from '../utils/pathUtils.js';
import Authenticator from './entities/Authenticator.js';
import ChatRoom from './entities/ChatRoom.js';
import Message from './entities/Message.js';

const config: Options = {
  entities: [Message, ChatRoom, Authenticator],
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
