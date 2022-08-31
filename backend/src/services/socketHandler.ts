import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@icalingua/types/socketIoTypes.js';
import { fastify } from 'fastify';
import fastifyIO from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';
import type { Socket } from 'socket.io';
import messageHandler from './messageHandler.js';
import { staticPath } from '../utils/pathUtils.js';

const server = fastify({ logger: true });
server.register(fastifyStatic, { root: staticPath });
server.register(fastifyIO.default, {
  cors: { origin: '*' },
});
server.listen({ port: 3000 }).catch((e) => {
  server.log.error(e);
  process.exit(1);
});

const socketPool: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>[] = [];

server.ready().then(() => {
  server.io.on('connection', (socket) => {
    socketPool.push(socket);
  });
});

messageHandler.forEach((e) => {
  socketPool.forEach((socket) => {
    socket.emit('newMessage', e);
  });
});

export default socketPool;
