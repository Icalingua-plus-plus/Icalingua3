import eTag from '@fastify/etag';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import { fastify } from 'fastify';
import fastifyIO from 'fastify-socket.io';
import winstonLogger from '../plugins/winstonLogger.js';
import apiRouter from '../routes/apiRouter.js';
import passwordSecretUtils from '../utils/passwordSecretUtils.js';
import { staticPath } from '../utils/pathUtils.js';

const { secret } = await passwordSecretUtils.loadKey();
const server = fastify({ logger: true });
server.register(fastifyIO.default, {
  cors: { origin: '*' },
});
server.register(jwt.default, {
  secret,
  sign: { algorithm: 'HS256' },
});
server.register(fastifyStatic, { root: staticPath });
server.register(winstonLogger);
server.register(eTag.default);
server.register(apiRouter, { prefix: '/api' });
server.setNotFoundHandler((req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).send('Not Found');
    return;
  }
  res.status(200).sendFile('index.html');
});

export default server;
