import HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage';
import type { IMessageQs, IMessageRes } from '@icalingua/types/http/HTTPMessage';
import type { RoomId } from '@icalingua/types/RoomId';
import axiosClient from './axiosClient';

/** 获取一个聊天室的最新消息 */
export const getMessages = async (roomId: RoomId, qs?: IMessageQs) => {
  const res = await axiosClient.client.get<IMessageRes>(`/messages/${roomId}/new`, { params: qs });
  return res.data;
};

/** 通过 chunk 来获取聊天室的信息 */
export const getMessagesByChunk = async (roomId: RoomId, chunk: number, qs?: IMessageQs) => {
  const res = await axiosClient.client.get<IMessageRes>(`/messages/${roomId}/${chunk}`, {
    params: qs,
  });
  return res.data;
};

/** 通过 `resId` 获取合并转发的聊天信息
 * @param resId 合并转发的 `resId`
 */
export const getForwardMsg = async (resId: string) => {
  const res = await axiosClient.client.get<HTTPForwardMessage[]>(`/messages/fwd/${resId}`);
  return res.data;
};
