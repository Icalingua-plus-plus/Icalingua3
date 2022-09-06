import configProvider from './services/configProvider.js';
import fastifyServer from './services/fastifyServer.js';
import socketPool from './services/socketHandler.js';
import keyUtils from './utils/keyUtils.js';

await configProvider.loadConfig();
socketPool.map(() => false);
fastifyServer.listen({ port: 3000 }).catch((e) => {
  fastifyServer.log.error(e);
  process.exit(1);
});
// Smoke test
keyUtils.getKey();
