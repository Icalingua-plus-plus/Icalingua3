import { setTimeout } from 'node:timers/promises';
import logger from '../utils/logger.js';
import verifyClient from '../utils/verifyClient.js';
import configProvider from './configProvider.js';
import server from './fastifyServer.js';

server.ready().then(() => {
  server.io.on('connection', async (socket) => {
    let valid = false;
    const challenge = Date.now().toString();
    socket.emit('challenge', challenge);
    socket.once('verify', async (signature) => {
      if (await verifyClient(signature, challenge)) {
        valid = true;
        socket.join('verified');
        logger.info(`Client connected, id: ${socket.id}`);
      }
    });
    await setTimeout(10000);
    if (!valid) socket.disconnect();
  });
  server.io.use((socket, next) => {
    socket.on('requestConfig', () => {
      socket.emit('sendConfig', configProvider.config);
    });
    socket.on('changeConfig', async (newConfig) => {
      configProvider.setConfig(newConfig);
      await configProvider.saveConfig();
      server.io.to('verified').emit('sendConfig', configProvider.config);
    });
    next();
  });
});

export default '';
