import type HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage.js';
import type { IMessageQs, IMessageRes } from '@icalingua/types/http/HTTPMessage.js';
import type { RoomId } from '@icalingua/types/RoomId.js';
import parseRoomId from '@icalingua/utils/parseRoomId.js';
import { FastifyInstance } from 'fastify';
import Message from '../database/entities/Message.js';
import { messageParse } from '../database/parser.js';
import { getEM } from '../database/storageProvider.js';
import { oicqClient } from '../services/oicqClient.js';
import getChatHistory from '../utils/getChatHistory.js';
import getLatestChunk from '../utils/getLatestChunk.js';
import logger from '../utils/logger.js';

/** `/api/messages` 路由 */
const messagesRouter = async (server: FastifyInstance) => {
  /** 获取一个聊天室的最新 chunk 里的消息 */
  server.get<{ Params: { roomId: RoomId }; Querystring: IMessageQs }>(
    '/:roomId/new',
    async (req, res) => {
      const { roomId } = req.params;
      await getChatHistory(roomId);
      /* 下面这些操作是为了对齐 chunk  */
      const latestChunk = await getLatestChunk(roomId);
      if (!latestChunk)
        return res.send({
          messages: [],
          count: 0,
          currentChunk: null,
          lastChunk: null,
          nextChunk: null,
        } as IMessageRes);
      const { roomType } = parseRoomId(roomId);
      /** 非私聊可用 seq 处理 */
      let messages;
      let count;
      if (roomType !== 'private') {
        const seqGte = latestChunk * 20;
        const seqLte = seqGte + 20;
        [messages, count] = await getEM().findAndCount(
          Message,
          { seq: { $gte: seqGte, $lte: seqLte }, roomId },
          { orderBy: { time: 'DESC' } },
        );
      } else {
        const timeGte = latestChunk * 86400;
        const timeLt = timeGte + 86400;
        [messages, count] = await getEM().findAndCount(
          Message,
          { time: { $gte: timeGte, $lt: timeLt }, roomId },
          { orderBy: { time: 'DESC' } },
        );
      }
      const oicqMessages = messages.reverse().map(messageParse);
      const data: IMessageRes = {
        messages: oicqMessages,
        count,
        currentChunk: latestChunk,
        lastChunk: latestChunk - 1,
        nextChunk: null,
      };
      return res.send(data);
    },
  );
  /** 按 chunk 获取聊天室的信息。分 chunk 的好处在于可以获取历史信息 */
  server.get<{ Params: { roomId: RoomId; chunk: string }; Querystring: IMessageQs }>(
    '/:roomId/:chunk',
    async (req, res) => {
      const { roomId, chunk: oriChunk } = req.params;
      const chunk = Number(oriChunk);
      const { roomType } = parseRoomId(roomId);
      const latestChunk = await getLatestChunk(roomId);
      if (!latestChunk)
        return res.send({
          messages: [],
          count: 0,
          currentChunk: chunk,
          lastChunk: null,
          nextChunk: null,
        } as IMessageRes);
      let messages;
      let count;
      /** 私聊消息用 time 处理，非私聊消息用 seq 处理 */
      if (roomType !== 'private') {
        const seqGte = chunk * 20;
        const seqLt = seqGte + 20;
        [messages, count] = await getEM().findAndCount(
          Message,
          { seq: { $gte: seqGte, $lt: seqLt }, roomId },
          { orderBy: { time: 'DESC' } },
        );
        if (count < 20) {
          if (count !== 0)
            logger.debug(JSON.stringify(messageParse(messages[messages.length - 1])));
          await getChatHistory(roomId, { chunk });
        }
        [messages, count] = await getEM().findAndCount(
          Message,
          { seq: { $gte: seqGte, $lt: seqLt }, roomId },
          { orderBy: { time: 'DESC' } },
        );
      } else {
        const timeGte = chunk * 86400;
        const timeLt = timeGte + 86400;
        await getChatHistory(roomId, { chunk });
        [messages, count] = await getEM().findAndCount(
          Message,
          { time: { $gte: timeGte, $lt: timeLt }, roomId },
          { orderBy: { time: 'DESC' } },
        );
      }
      const oicqMessages = messages.reverse().map(messageParse);
      const data: IMessageRes = {
        messages: oicqMessages,
        count,
        currentChunk: chunk,
        lastChunk: chunk - 1 < 0 ? null : chunk - 1,
        nextChunk: chunk + 1 <= latestChunk ? chunk + 1 : null,
      };
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
