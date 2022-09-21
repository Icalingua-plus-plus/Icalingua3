import fp from 'fastify-plugin';
import configProvider from '../services/configProvider.js';
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
      const info = await req.jwtVerify<{ iat: number; id: string; webAuthn?: boolean }>();
      if (!passwordSecretUtils.isValid(info.iat)) {
        res.status(401).send('Unauthorized');
        return;
      }
      if (configProvider.config.onlyWebAuthn && !info.webAuthn) {
        res.status(401).send('Server only accepts WebAuthn');
        return;
      }
    } catch (e) {
      res.status(401).send('Unauthorized');
    }
  });
});

export default needAuth;
