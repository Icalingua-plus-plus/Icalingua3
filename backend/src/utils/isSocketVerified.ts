import server from '../services/fastifyServer.js';

/** 检验一个 socket 是否已验证
 * @param id socket 的 id
 * @returns 是否已验证，`true` 已验证，`false` 未验证
 */
const isSocketVerified = async (id: string) => {
  const sockets = await server.io.in('verified').allSockets();
  return sockets.has(id);
};

export default isSocketVerified;
