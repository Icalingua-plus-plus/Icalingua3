import { MessageItem } from '@icalingua/types/http/HTTPMessage';
import type { ClientToServerEvents, ServerToClientEvents } from '@icalingua/types/socketIoTypes';
import { Observable } from 'rxjs';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

/** 客户端 socket 类 */
class ClientSocket {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;

  /** 收到新消息 */
  declare onMessage: Observable<MessageItem>;

  /** 更新内部的 socket 对象 */
  init(address: string, token: string) {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(address, {
      transports: ['websocket'],
      auth: { token: `Bearer ${token}` },
    });
    this.socket = socket;
    this.onMessage = new Observable((subscriber) => {
      socket.on('newMessage', (msg) => subscriber.next(msg));
    });
  }
}

const clientSocket = new ClientSocket();

export default clientSocket;
