import fastifyIO from 'fastify-socket.io';
import fastifyStatic from '@fastify/static';
import { fastify } from 'fastify';
import { staticPath } from '../utils/pathUtils.js';

const server = fastify({ logger: true });
server.register(fastifyIO.default, {
  cors: { origin: '*' },
});
server.register(fastifyStatic, { root: staticPath });
server.setNotFoundHandler((req, res) => {
  res.status(200).sendFile('index.html');
});

export default server;
