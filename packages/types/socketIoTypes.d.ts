import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';

export interface ServerToClientEvents {
  newMessage: (message: GroupMessageEvent | PrivateMessageEvent | DiscussMessageEvent) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {}

export interface SocketData {}
