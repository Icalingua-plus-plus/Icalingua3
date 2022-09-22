import { RoomId } from '@icalingua/types/RoomId.js';
import parseRoomId from '@icalingua/utils/parseRoomId.js';
import { PrivateMessage } from 'oicq';
import ChatRoom from '../database/entities/ChatRoom.js';
import Message from '../database/entities/Message.js';
import { getEM } from '../database/storageProvider.js';
import { oicqClient } from '../services/oicqClient.js';
import logger from './logger.js';

/** 按天为单位获取聊天记录，对私聊使用
 * @return 当天的消息，不保证唯一，需要靠数据库去重
 */
const getChatHistoryByDay = async (roomId: RoomId, chunk: number) => {
  if (!oicqClient) throw new Error('oicqClient is not ready');
  const { id } = parseRoomId(roomId);
  const messages: PrivateMessage[] = [];
  const user = oicqClient.pickUser(id);
  const timeGte = chunk * 86400;
  let timeLte = timeGte + 86400;
  let fetchedMessages: PrivateMessage[] = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    fetchedMessages = await user.getChatHistory(timeLte);
    messages.push(...fetchedMessages);
    if (fetchedMessages.length > 0) timeLte = fetchedMessages[0].time;
  } while (fetchedMessages.length !== 0 && fetchedMessages[0].time > timeGte);
  return messages;
};

/** 获取聊天室历史消息，并存入数据库 */
const getChatHistory = async (roomId: RoomId, opt?: { chunk?: number }) => {
  if (!oicqClient) throw new Error('oicqClient is not ready');
  const { roomType, id } = parseRoomId(roomId);
  let messages;
  switch (roomType) {
    case 'group': {
      const group = oicqClient.pickGroup(id);
      messages = await group.getChatHistory(opt?.chunk ? opt.chunk * 20 + 20 : undefined);
      logger.debug(JSON.stringify(messages[messages.length - 1]));
      break;
    }
    case 'private': {
      messages = await getChatHistoryByDay(
        roomId,
        opt?.chunk || Math.floor(Date.now() / 1000 / 86400),
      );
      break;
    }
    default:
      return Promise.resolve();
  }
  if (messages.length === 0) return Promise.resolve();
  const msgsToInsert = messages.map((msg) => new Message(msg));
  await getEM()
    .qb(Message)
    .insert(msgsToInsert)
    .onConflict(['room_id', 'seq', 'rand', 'time'])
    .merge()
    .execute();
  const roomEm = getEM();
  let room = await roomEm.findOne(ChatRoom, { roomId });
  if (!room) {
    switch (roomType) {
      case 'group': {
        const group = oicqClient.pickGroup(id);
        room = new ChatRoom(group);
        break;
      }
      case 'private': {
        const user = oicqClient.pickUser(id);
        room = new ChatRoom(user);
        break;
      }
      default: {
        const discuss = oicqClient.pickDiscuss(id);
        room = new ChatRoom(discuss);
        break;
      }
    }
    await roomEm.persistAndFlush(room);
  }
  if (!room.lastMessageTime || room.lastMessageTime < messages[messages.length - 1].time) {
    room.lastMessageTime = messages[messages.length - 1].time;
    room.lastMessage = messages[messages.length - 1].raw_message;
    await roomEm.flush();
  }
  return Promise.resolve();
};

export default getChatHistory;
