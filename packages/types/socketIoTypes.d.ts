import { MessageItem } from './http/HTTPMessage';

export interface ServerToClientEvents {
  /** 收到新消息 */
  newMessage: (message: MessageItem) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
