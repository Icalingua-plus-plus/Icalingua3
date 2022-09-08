import fp from 'fastify-plugin';
import isSocketVerified from '../utils/isSocketVerified.js';

const apiGuard = fp.default(async (server) => {
  server.addHook('preHandler', async (req, res) => {
    if (!req.url.startsWith('/api')) return;
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    if (!(await isSocketVerified(req.headers.authorization.substring(7)))) {
      res.status(403).send('Forbidden');
    }
  });
});

export default apiGuard;
