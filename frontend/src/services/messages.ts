import type { IMessageQs, IMessageRes } from '@icalingua/types/http/HTTPMessage';
import type RoomId from '@icalingua/types/RoomId';
import axiosClient from './axiosClient';

/** 获取一个聊天室的信息 */
// eslint-disable-next-line import/prefer-default-export
export const getMessages = async (roomId: RoomId, qs?: IMessageQs) => {
  const res = await axiosClient.client.get<IMessageRes>(`/messages/${roomId}`, { params: qs });
  return res.data;
};
