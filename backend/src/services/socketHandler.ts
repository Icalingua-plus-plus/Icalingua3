import { setTimeout } from 'node:timers/promises';
import logger from '../utils/logger.js';
import verifyClient from '../utils/verifyClient.js';
import server from './fastifyServer.js';

server.ready().then(() => {
  server.io.on('connection', async (socket) => {
    const res = await verifyClient(socket.handshake.auth.token as string | undefined);
    await setTimeout(10000);
    if (!res) return socket.disconnect();
    logger.info(`Client connected, id: ${socket.id}`);
    return socket.join('verified');
  });
});
