import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Message } from './entities/Message.js';
import { sqliteDbPath } from '../utils/pathUtils.js';

const config: Options = {
  entities: [Message],
  dbName: sqliteDbPath,
  type: 'better-sqlite',
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
