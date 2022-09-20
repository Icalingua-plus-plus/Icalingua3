import server from '../services/fastifyServer.js';

/** 验证客户端 */
const verifyClient = async (authorization?: string) => {
  if (!authorization) return false;
  const jwToken = authorization.substring(7);
  let res;
  try {
    server.jwt.verify(jwToken);
    res = true;
  } catch (error) {
    res = false;
  }
  return res;
};

export default verifyClient;
