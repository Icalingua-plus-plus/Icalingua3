import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@icalingua/types/socketIoTypes.js';
import { setTimeout } from 'node:timers/promises';
import type { Socket } from 'socket.io';
import verifyClient from '../utils/verifyClient.js';
import server from './fastifyServer.js';
import messageHandler from './messageHandler.js';

const socketPool: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>[] = [];

server.ready().then(() => {
  server.io.on('connection', async (socket) => {
    let valid = false;
    const challenge = Date.now().toString();
    socket.emit('challenge', challenge);
    socket.once('verify', async (signature) => {
      if (await verifyClient(signature, challenge)) {
        valid = true;
        socketPool.push(socket);
      }
    });
    await setTimeout(10000);
    if (!valid) socket.disconnect();
  });
});

messageHandler.forEach((e) => {
  socketPool.forEach((socket) => {
    socket.emit('newMessage', e);
  });
});

export default socketPool;
