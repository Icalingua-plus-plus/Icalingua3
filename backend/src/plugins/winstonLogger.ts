import fp from 'fastify-plugin';
import logger from '../utils/logger.js';

/** 用 Winston 记录请求与响应 */
const winstonLogger = fp.default(async (server) => {
  server.addHook('onResponse', (req, res, done) => {
    done();
    const { method, url } = req;
    logger.http({
      message: `${url} - ${res.getResponseTime()}ms`,
      method,
      statusCode: res.statusCode,
    });
  });
});

export default winstonLogger;
