import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes.js';
import type RoomId from '@icalingua/types/RoomId.js';
import { FastifyInstance } from 'fastify';
import ChatRoom from '../database/entities/ChatRoom.js';
import { getEM } from '../database/storageProvider.js';
import { oicqClient } from '../services/oicqClient.js';
import isSocketVerified from '../utils/isSocketVerified.js';

/** 从数据库里的 ChatRoom 对象生成响应（目前只是获取缩略图）
 * @param room 数据库里的 ChatRoom 对象
 */
const getChatRoomResItem = (room: ChatRoom) => {
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
};

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
    const data: ChatRoomsResItem[] = rooms.map(getChatRoomResItem);
    res.send(data);
  });
  server.get<{ Params: { roomId: RoomId.default } }>('/chatroom/:roomId', async (req, res) => {
    if (!oicqClient) return res.status(500).send('oicqClient is not ready');
    const { roomId } = req.params;
    let room = await getEM().findOne(ChatRoom, { roomId });
    /** 如果数据库里没有 room，则新建一个 */
    if (!room) {
      const [roomType, id] = roomId.split('-');
      switch (roomType) {
        case 'group':
          room = new ChatRoom(oicqClient.pickGroup(Number(id)));
          break;
        case 'discuss':
          room = new ChatRoom(oicqClient.pickDiscuss(Number(id)));
          break;
        default:
          room = new ChatRoom(oicqClient.pickFriend(Number(id)));
      }
      /** 有可能会脏查询和 Conflict，等遇到这个情况再换成 upsert 之类的 */
      await getEM().persistAndFlush(room);
    }
    return res.send(getChatRoomResItem(room));
  });
};

export default apiRouter;
