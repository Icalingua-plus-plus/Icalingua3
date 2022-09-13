import { IAppConfig } from '@icalingua/types/IAppConfig';
import type { ClientToServerEvents, ServerToClientEvents } from '@icalingua/types/socketIoTypes';
import type { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';
import { Observable } from 'rxjs';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import signChallenge from '../utils/signChallenge';

/** 客户端 socket 类 */
class ClientSocket {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;

  /** 收到新消息 */
  declare onMessage: Observable<GroupMessageEvent | PrivateMessageEvent | DiscussMessageEvent>;

  /** 收到新配置 */
  declare onSendConfig: Observable<IAppConfig>;

  /** 更新内部的 socket 对象 */
  init(address: string, key: string) {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(address, {
      transports: ['websocket'],
    });
    this.socket = socket;
    socket.on('challenge', async (ev) => {
      const signature = await signChallenge(ev, key);
      socket.emit('verify', signature).emit('requestConfig').emit('requestToken');
    });
    this.onMessage = new Observable((subscriber) => {
      socket.on('newMessage', (msg) => subscriber.next(msg));
    });
    this.onSendConfig = new Observable((subscriber) => {
      socket.on('sendConfig', (cfg) => subscriber.next(cfg));
    });
  }
}

const clientSocket = new ClientSocket();

export default clientSocket;
