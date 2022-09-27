import { MessageItem } from '@icalingua/types/http/HTTPMessage.js';
import { Message as OicqMessage } from 'oicq';
import configProvider from '../services/configProvider.js';
import { getOicqClient } from '../services/oicqClient.js';
import ChatRoom from './entities/ChatRoom.js';
import Message from './entities/Message.js';

/** 从数据库中的 Message 转化为通过网络传输的 Message
 * @param message 数据库中的 Message
 */
export const messageParse = (message: Message) => {
  const oicqMessage = OicqMessage.deserialize(message.content, configProvider.config.qid);
  const avatar = getOicqClient()?.pickUser(oicqMessage.sender.user_id)?.getAvatarUrl() || null;
  return Object.assign(oicqMessage, {
    avatar,
    id: message.id,
    roomId: message.roomId,
  }) as MessageItem;
};

/** 从数据库里的 ChatRoom 对象生成响应（目前只是获取缩略图）
 * @param room 数据库里的 ChatRoom 对象
 */
export const roomParse = (room: ChatRoom) => {
  const roomId = room.roomId.replace(/.*-/, '');
  if (room.roomId.startsWith('group-')) {
    const group = getOicqClient()?.pickGroup(Number(roomId));
    return { ...room, avatar: group?.getAvatarUrl() || null };
  }
  if (room.roomId.startsWith('discuss-')) {
    // const discuss = getOicqClient().pickDiscuss(Number(roomId));
    return { ...room, avatar: null };
  }
  const user = getOicqClient()?.pickUser(Number(roomId));
  return { ...room, avatar: user?.getAvatarUrl() || null };
};
