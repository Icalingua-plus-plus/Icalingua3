import { FastifyInstance } from 'fastify';
import axios from 'axios';
import logger from '../utils/logger.js';

/** 绕过 QQ 图片防盗链 */
const corsRouter = async (server: FastifyInstance) => {
  server.get<{ Querystring: { url: string } }>('/', async (req, res) => {
    const file = await axios.default.get<Buffer>(req.query.url, {
      responseType: 'arraybuffer',
      headers: { accept: req.headers.accept! },
    });
    logger.info(JSON.stringify(file.headers));
    res
      .header('Content-Type', file.headers['content-type'])
      .header('Cache-Control', file.headers['cache-control'])
      .header('Date', file.headers.date)
      .header('Last-Modified', file.headers['last-modified'])
      .code(file.status)
      .send(file.data);
  });
};

export default corsRouter;
