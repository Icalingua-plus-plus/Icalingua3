import { RoomId } from '@icalingua/types/RoomId.js';
import calculateChunk, { calculatePrivateChunk } from '@icalingua/utils/calculateChunk.js';
import parseRoomId from '@icalingua/utils/parseRoomId.js';
import Message from '../database/entities/Message.js';
import { getEM } from '../database/storageProvider.js';

/** 获取一个聊天室最新的 chunk */
const getLatestChunk = async (roomId: RoomId) => {
  const { roomType } = parseRoomId(roomId);
  const latestMessage = await getEM().findOne(Message, { roomId }, { orderBy: { time: 'DESC' } });
  if (!latestMessage) return null;
  if (roomType !== 'private') return calculateChunk(latestMessage.seq);
  return calculatePrivateChunk(latestMessage.time);
};

export default getLatestChunk;
