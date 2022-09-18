import RoomId, { RoomType } from '@icalingua/types/RoomId.js';

/** 将一个 `roomId` 解码为聊天室类型和聊天室 id
 * @param roomId 聊天室 的 roomId
 */
const parseRoomId = (roomId: RoomId.default) => {
  const [roomType, id] = roomId.split('-');
  return { roomType, id: Number(id) } as { roomType: RoomType; id: number };
};

export default parseRoomId;
