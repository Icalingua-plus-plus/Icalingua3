import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';
import { IAppConfig } from './IAppConfig';

export interface ServerToClientEvents {
  /** 收到新消息 */
  newMessage: (message: GroupMessageEvent | PrivateMessageEvent | DiscussMessageEvent) => void;
  /** 服务端向客户端发送一随机字符串，让客户端对之签名 */
  challenge: (challange: string) => void;
  /** 服务端向客户端发送服务端配置 */
  sendConfig: (config: IAppConfig) => void;
  /** 服务端向客户端发送 Token，用于客户端 HTTP 请求 */
  sendToken: (token: string) => void;
}

export interface ClientToServerEvents {
  /** 客户端对服务端的 challenge 内容进行签名后发送 */
  verify: (signature: Uint8Array) => void;
  /** 客户端向服务端请求服务端配置 */
  requestConfig: () => void;
  /** 客户端修改服务端配置 */
  changeConfig: (config: IAppConfig) => void;
  /** 客户端向服务端请求 Token，用于客户端 HTTP 请求 */
  requestToken: () => void;
}

export interface InterServerEvents {}

export interface SocketData {}
