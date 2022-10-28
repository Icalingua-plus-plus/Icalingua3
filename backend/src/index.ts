import configProvider from './services/configProvider.js';
import fastifyServer from './services/fastifyServer.js';
import oicqInit from './services/oicqClient.js';
import './services/socketHandler.js';
import argv from './utils/argv.js';
import logger from './utils/logger.js';

await configProvider.loadConfig();
if (configProvider.config.qid && !argv.noStartOicq) {
  await oicqInit();
}
fastifyServer.listen({ port: 3000, host: argv.host }).catch((e) => {
  fastifyServer.log.error(e);
  process.exit(1);
});

process.on('uncaughtException', (e) => {
  logger.error(`${e.message} ${e.stack ? e.stack : ''}`);
  process.exit(1);
});
