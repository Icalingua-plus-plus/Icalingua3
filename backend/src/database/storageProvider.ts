import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';

/** 数据库 */
const db = await MikroORM.init(config);

const migrator = db.getMigrator();
await migrator.up();

/** 获取 `EntityManager` */
export const getEM = () => db.em.fork();

export default db;
