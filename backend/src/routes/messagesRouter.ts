import type HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage.js';
import type { IMessageQs, IMessageRes } from '@icalingua/types/http/HTTPMessage.js';
import type { RoomId } from '@icalingua/types/RoomId.js';
import calculateChunk from '@icalingua/utils/calculateChunk.js';
import { FastifyInstance } from 'fastify';
import Message from '../database/entities/Message.js';
import { messageParse } from '../database/parser.js';
import { getEM } from '../database/storageProvider.js';
import { oicqClient } from '../services/oicqClient.js';
import getChatHistory from '../utils/getChatHistory.js';
import logger from '../utils/logger.js';

/** `/api/messages` 路由 */
const messagesRouter = async (server: FastifyInstance) => {
  /** 用于私聊消息的处理，因为私聊消息 seq 不连续 */
  server.get<{ Params: { roomId: RoomId }; Querystring: IMessageQs }>(
    '/:roomId',
    async (req, res) => {
      const { roomId } = req.params;
      const { seqLte, seqGte, timeLte, timeGte, limit } = req.query;
      const [messages, count] = await getEM().findAndCount(
        Message,
        {
          seq: { $gte: seqGte || 0, $lte: seqLte || Number.MAX_SAFE_INTEGER },
          time: { $gte: timeGte || 0, $lte: timeLte || Number.MAX_SAFE_INTEGER },
          roomId,
        },
        { limit: limit || 20, orderBy: { time: 'DESC' } },
      );
      const oicqMessages = messages.reverse().map(messageParse);
      const data: IMessageRes = { messages: oicqMessages, count };
      return res.send(data);
    },
  );
  /** 获取一个聊天室的最新 chunk 里的消息 */
  server.get<{ Params: { roomId: RoomId }; Querystring: IMessageQs }>(
    '/:roomId/new',
    async (req, res) => {
      const { roomId } = req.params;
      await getChatHistory(roomId);
      /* 下面这些操作是为了对齐 chunk  */
      const latestMessage = await getEM().findOne(
        Message,
        { roomId },
        { orderBy: { time: 'DESC' } },
      );
      if (!latestMessage) return res.send({ messages: [], count: 0 } as IMessageRes);
      const latestChunk = calculateChunk(latestMessage.seq);
      const seqGte = latestChunk * 20;
      const seqLte = seqGte + 20;
      const [messages, count] = await getEM().findAndCount(
        Message,
        { seq: { $gte: seqGte, $lte: seqLte }, roomId },
        { orderBy: { time: 'DESC' } },
      );
      const oicqMessages = messages.reverse().map(messageParse);
      const data: IMessageRes = { messages: oicqMessages, count };
      return res.send(data);
    },
  );
  /** 按 chunk 获取聊天室的信息。分 chunk 的好处在于可以获取历史信息 */
  server.get<{ Params: { roomId: RoomId; chunk: number }; Querystring: IMessageQs }>(
    '/:roomId/:chunk',
    async (req, res) => {
      const { roomId, chunk } = req.params;
      const seqGte = chunk * 20;
      const seqLt = seqGte + 20;
      let [messages, count] = await getEM().findAndCount(
        Message,
        { seq: { $gte: seqGte, $lt: seqLt }, roomId },
        { orderBy: { time: 'DESC' } },
      );
      if (count < 20) {
        if (count !== 0) logger.debug(JSON.stringify(messageParse(messages[messages.length - 1])));
        await getChatHistory(roomId, { chunk });
      }
      [messages, count] = await getEM().findAndCount(
        Message,
        { seq: { $gte: seqGte, $lt: seqLt }, roomId },
        { orderBy: { time: 'DESC' } },
      );
      const oicqMessages = messages.reverse().map(messageParse);
      const data: IMessageRes = { messages: oicqMessages, count };
      return res.send(data);
    },
  );
  /** 获取转发消息 */
  server.get<{ Params: { resId: string } }>('/fwd/:resId', async (req, res) => {
    if (!oicqClient) return res.status(500).send('OicqClient is not ready');
    const { resId } = req.params;
    const messages = await oicqClient.getForwardMsg(resId);
    const httpMessages: HTTPForwardMessage.default[] = messages.map((message) => {
      const avatar = oicqClient?.pickUser(message.user_id)?.getAvatarUrl() || null;
      return Object.assign(message, { avatar, seq: null });
    });
    return res.send(httpMessages);
  });
};

export default messagesRouter;
