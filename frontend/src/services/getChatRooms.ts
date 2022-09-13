import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import axiosClient from './axiosClient';

/** 获取聊天室 */
const getChatRooms = async () => {
  const res = await axiosClient.client.get<ChatRoomsResItem[]>('/api/chatRooms');
  return res.data;
};

export default getChatRooms;
