import { setTimeout } from 'node:timers/promises';
import oicqClient from '../instances/oicqClient.js';
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
      }
    });
    socket.on('requestConfig', () => {
      socket.emit('sendConfig', configProvider.config);
    });
    socket.on('changeConfig', async (newConfig) => {
      configProvider.setConfig(newConfig);
      await configProvider.saveConfig();
    });
    await setTimeout(10000);
    if (!valid) socket.disconnect();
  });
});

oicqClient.onMessage.subscribe((e) => {
  server.io.to('verified').emit('newMessage', e);
});

export default '';
