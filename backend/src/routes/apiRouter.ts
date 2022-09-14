import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes.js';
import type { IMessageQs, IMessageRes } from '@icalingua/types/http/HTTPMessage.js';
import type RoomId from '@icalingua/types/RoomId.js';
import { FastifyInstance } from 'fastify';
import ChatRoom from '../database/entities/ChatRoom.js';
import Message from '../database/entities/Message.js';
import { messageParse, roomParse } from '../database/parser.js';
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
    const data: ChatRoomsResItem[] = rooms.map(roomParse);
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
    return res.send(roomParse(room));
  });
  server.get<{ Params: { roomId: RoomId.default }; Querystring: IMessageQs }>(
    '/messages/:roomId',
    async (req, res) => {
      const { roomId } = req.params;
      const { seqLte, seqGte, timeLte, timeGte, limit } = req.query;
      const [messages, totalCount] = await getEM().findAndCount(
        Message,
        {
          seq: { $gte: seqGte || 0, $lte: seqLte || Number.MAX_SAFE_INTEGER },
          time: { $gte: timeGte || 0, $lte: timeLte || Number.MAX_SAFE_INTEGER },
          roomId,
        },
        { limit: limit || 20, orderBy: { time: 'DESC' } },
      );
      const oicqMessages = messages.map(messageParse);
      oicqMessages.reverse();
      const data: IMessageRes = { messages: oicqMessages, totalCount };
      return res.send(data);
    },
  );
};

export default apiRouter;
