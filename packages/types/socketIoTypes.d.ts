import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';
import { IAppConfig } from './IAppConfig';

export interface ServerToClientEvents {
  newMessage: (message: GroupMessageEvent | PrivateMessageEvent | DiscussMessageEvent) => void;
  challenge: (challange: string) => void;
  sendConfig: (config: IAppConfig) => void;
}

export interface ClientToServerEvents {
  verify: (signature: Uint8Array) => void;
  requestConfig: () => void;
  changeConfig: (config: IAppConfig) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
