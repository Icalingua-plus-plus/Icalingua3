import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';

export interface ServerToClientEvents {
  newMessage: (message: GroupMessageEvent | PrivateMessageEvent | DiscussMessageEvent) => void;
  challenge: (challange: string) => void;
}

export interface ClientToServerEvents {
  verify: (signature: Uint8Array) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
