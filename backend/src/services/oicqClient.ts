import { Client, Config, DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';
import { Observable } from 'rxjs';
import { oicqDataPath } from '../utils/pathUtils.js';
import configProvider from './configProvider.js';
import server from './fastifyServer.js';
import registerMessageHandler from './registerMessageHandler.js';

/** 用 rxjs 包装的 Client类 */
export class ObservableClient extends Client {
  /** 已登录 */
  loggedIn = false;

  constructor(uin: number, conf: Config) {
    super(uin, conf);
    this.onMessage = new Observable<PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent>(
      (subscriber) => {
        super.on('message', (e) => subscriber.next(e));
      },
    );
    this.onSystemOnline = new Observable<void>((subscriber) => {
      this.on('system.online', () => {
        this.loggedIn = true;
        subscriber.next();
      });
    });
  }

  /** 收到消息 */
  onMessage: Observable<PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent>;

  /** 登录成功 */
  onSystemOnline: Observable<void>;
}

export const status = {
  /** 表示 init 已被调用，并不是正在运行的意思 */
  running: false,
  /** 表示 oicq 已经登录 */
  loggedIn: false,
};

/** 初始化 oicq 实例并登录 */
const init = async () => {
  try {
    status.running = true;
    const oicqClient = new ObservableClient(configProvider.config.qid, {
      platform: 2,
      data_dir: oicqDataPath,
    });
    oicqClient.onMessage.subscribe((e) => {
      server.io.to('verified').emit('newMessage', e);
    });
    await oicqClient.login(configProvider.config.password);
    status.loggedIn = true;
    registerMessageHandler(oicqClient);
  } catch (e) {
    status.loggedIn = false;
  }
};

export default init;
