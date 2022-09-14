import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import type RoomId from '@icalingua/types/RoomId';
import axiosClient from './axiosClient';

/** 获取聊天室列表 */
const getChatRooms = async () => {
  const res = await axiosClient.client.get<ChatRoomsResItem[]>('/chatRooms');
  return res.data;
};

/** 获取聊天室 */
export const getChatRoom = async (roomId: RoomId) => {
  const res = await axiosClient.client.get<ChatRoomsResItem>(`/chatroom/${roomId}`);
  return res.data;
};

export default getChatRooms;
