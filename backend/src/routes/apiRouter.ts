import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes.js';
import { FastifyInstance } from 'fastify';
import ChatRoom from '../database/entities/ChatRoom.js';
import { getEM } from '../database/storageProvider.js';
import { oicqClient } from '../services/oicqClient.js';
import isSocketVerified from '../utils/isSocketVerified.js';

/** `/api` 路由 */
const apiRouter = async (server: FastifyInstance) => {
  server.addHook('preHandler', async (req, res) => {
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    if (!(await isSocketVerified(req.headers.authorization.substring(7)))) {
      res.status(403).send('Forbidden');
    }
  });
  /** 获取聊天室列表 */
  server.get('/chatRooms', async (req, res) => {
    const rooms = await getEM().find(ChatRoom, {}, { orderBy: { lastMessageTime: 'DESC' } });
    const data: ChatRoomsResItem[] = rooms.map((room) => {
      const roomId = room.roomId.replace(/.*-/, '');
      if (room.roomId.startsWith('group-')) {
        const group = oicqClient?.pickGroup(Number(roomId));
        return { ...room, avatar: group?.getAvatarUrl() || null };
      }
      if (room.roomId.startsWith('discuss-')) {
        // const discuss = oicqClient.pickDiscuss(Number(roomId));
        return { ...room, avatar: null };
      }
      const user = oicqClient?.pickUser(Number(roomId));
      return { ...room, avatar: user?.getAvatarUrl() || null };
    });
    res.send(data);
  });
};

export default apiRouter;
