import configProvider from './services/configProvider.js';
import fastifyServer from './services/fastifyServer.js';
import oicqInit from './services/oicqClient.js';
import socketHandler from './services/socketHandler.js';
import argv from './utils/argv.js';
import keyUtils from './utils/keyUtils.js';
import logger from './utils/logger.js';

await configProvider.loadConfig();
if (configProvider.config.qid && !argv.noStartOicq) {
  await oicqInit();
}
// 下面这行代码没有意义，只是为了注册事件监听器
socketHandler.concat('');
fastifyServer.listen({ port: 3000 }).catch((e) => {
  fastifyServer.log.error(e);
  process.exit(1);
});
// Smoke test
keyUtils.getKey();

process.on('uncaughtException', (e) => {
  logger.error(`${e.message} ${e.stack ? e.stack : ''}`);
  process.exit(1);
});
