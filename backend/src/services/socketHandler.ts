import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@icalingua/types/socketIoTypes.js';
import crypto from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import type { Socket } from 'socket.io';
import oicqClient from '../instances/oicqClient.js';
import verifyClient from '../utils/verifyClient.js';
import server from './fastifyServer.js';

// eslint-disable-next-line import/no-mutable-exports
let socketPool: {
  id: string;
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
}[] = [];

server.ready().then(() => {
  server.io.on('connection', async (socket) => {
    const id = crypto.webcrypto.randomUUID();
    let valid = false;
    const challenge = Date.now().toString();
    socket.emit('challenge', challenge);
    socket.once('verify', async (signature) => {
      if (await verifyClient(signature, challenge)) {
        valid = true;
        socketPool.push({ id, socket });
        socket.on('disconnect', () => {
          socketPool = socketPool.filter((item) => item.id !== id);
        });
      }
    });
    await setTimeout(10000);
    if (!valid) socket.disconnect();
  });
});

oicqClient.onMessage.forEach((e) => {
  socketPool.forEach((item) => {
    item.socket.emit('newMessage', e);
  });
});

export default socketPool;
