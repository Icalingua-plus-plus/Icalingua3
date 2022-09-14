import type { DiscussMessage, GroupMessage, PrivateMessage } from 'oicq';
import RoomId from '../RoomId';

export interface IMessageQs {
  /** seq 最大者 */
  seqLte?: number;
  /** seq 最小者 */
  seqGte?: number;
  /** 时间最大者 */
  timeLte?: number;
  /** 时间最小者 */
  timeGte?: number;
  /** 数量限制 */
  limit?: number;
}

export type EMessage = PrivateMessage | GroupMessage | DiscussMessage;

export type MessageItem = EMessage & { avatar: string | null; id: string; roomId: RoomId };

export interface IMessageRes {
  messages: MessageItem[];
  totalCount: number;
}
