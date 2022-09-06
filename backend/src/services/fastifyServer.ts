import fastifyStatic from '@fastify/static';
import { fastify, FastifyBaseLogger } from 'fastify';
import fastifyIO from 'fastify-socket.io';
import logger from '../utils/logger.js';
import { staticPath } from '../utils/pathUtils.js';

const server = fastify({ logger: logger as unknown as FastifyBaseLogger });
server.register(fastifyIO.default, {
  cors: { origin: '*' },
});
server.register(fastifyStatic, { root: staticPath });
server.setNotFoundHandler((req, res) => {
  (res.status(200) as any).sendFile('index.html');
});

export default server;
