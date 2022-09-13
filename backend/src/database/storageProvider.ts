import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { MikroORM, Options } from '@mikro-orm/core';
import config from './mikro-orm.config.js';

/** 数据库 */
const db = await MikroORM.init<BetterSqliteDriver>(config as Options<BetterSqliteDriver>);
const migrator = db.getMigrator();
await migrator.up();

/** 获取 `EntityManager` */
export const getEM = () => db.em.fork();

export default db;
