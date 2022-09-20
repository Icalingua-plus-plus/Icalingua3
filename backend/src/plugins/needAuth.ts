import fp from 'fastify-plugin';
import passwordSecretUtils from '../utils/passwordSecretUtils.js';

/** 需要登录
 * @example ```typescript
 * // In your routes
 * server.register(needAuth);
 * ```
 */
const needAuth = fp.default(async (server) => {
  server.addHook('preHandler', async (req, res) => {
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    try {
      const info = await req.jwtVerify<{ iat: number; id: string }>();
      if (!passwordSecretUtils.isValid(info.iat)) {
        res.status(401).send('Unauthorized');
        return;
      }
    } catch (e) {
      res.status(401).send('Unauthorized');
    }
  });
});

export default needAuth;
