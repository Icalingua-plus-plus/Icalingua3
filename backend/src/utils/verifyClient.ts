import configProvider from '../services/configProvider.js';
import server from '../services/fastifyServer.js';
import passwordSecretUtils from './passwordSecretUtils.js';

/** 验证客户端 */
const verifyClient = async (authorization?: string) => {
  if (!authorization) return false;
  const jwToken = authorization.substring(7);
  let res;
  try {
    const info = server.jwt.verify<{ iat: number; id: string; webAuthn?: boolean }>(jwToken);
    res = true;
    if (!passwordSecretUtils.isValid(info.iat)) {
      res = false;
    }
    if (configProvider.config.onlyWebAuthn && !info.webAuthn) {
      res = false;
    }
  } catch (error) {
    res = false;
  }
  return res;
};

export default verifyClient;
