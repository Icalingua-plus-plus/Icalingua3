import fastifyStatic from '@fastify/static';
import { fastify } from 'fastify';
import fastifyIO from 'fastify-socket.io';
import apiGuard from '../plugins/apiGuard.js';
import winstonLogger from '../plugins/winstonLogger.js';
import { staticPath } from '../utils/pathUtils.js';

const server = fastify({ logger: true });
server.register(fastifyIO.default, {
  cors: { origin: '*' },
});
server.register(fastifyStatic, { root: staticPath });
server.register(winstonLogger);
server.register(apiGuard);
server.setNotFoundHandler((req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).send('Not Found');
    return;
  }
  res.status(200).sendFile('index.html');
});

export default server;
