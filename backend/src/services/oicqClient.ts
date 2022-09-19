import {
  Client,
  Config,
  DiscussMessageEvent,
  GroupMessageEvent,
  PrivateMessage,
  PrivateMessageEvent,
} from 'oicq';
import { Observable } from 'rxjs';
import { oicqDataPath } from '../utils/pathUtils.js';
import configProvider from './configProvider.js';
import registerMessageHandler from './registerMessageHandler.js';

/** 用 rxjs 包装的 Client类 */
export class ObservableClient extends Client {
  constructor(uin: number, conf: Config) {
    super(uin, conf);
    this.onMessage = new Observable<PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent>(
      (subscriber) => {
        super.on('message', (e) => subscriber.next(e));
      },
    );
    this.onSystemOnline = new Observable<void>((subscriber) => {
      this.on('system.online', () => subscriber.next());
    });
    this.onSyncMessage = new Observable<PrivateMessage>((subscriber) => {
      this.on('sync.message', (e) => subscriber.next(e));
    });
  }

  /** 收到消息 */
  onMessage: Observable<PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent>;

  /** 私聊消息同步 */
  onSyncMessage: Observable<PrivateMessage>;

  /** 登录成功 */
  onSystemOnline: Observable<void>;
}

export const status = {
  /** 表示 init 已被调用，并不是正在运行的意思 */
  running: false,
  /** 表示 oicq 已经登录 */
  loggedIn: false,
};

// eslint-disable-next-line import/no-mutable-exports
export let oicqClient: ObservableClient | undefined;

/** 初始化 oicq 实例并登录 */
const oicqInit = async () => {
  try {
    status.running = true;
    oicqClient = new ObservableClient(configProvider.config.qid, {
      platform: 2,
      data_dir: oicqDataPath,
      log_level: 'warn',
    });
    await oicqClient.login(configProvider.config.password);
    status.loggedIn = true;
    registerMessageHandler(oicqClient);
  } catch (e) {
    status.loggedIn = false;
  }
};

export default oicqInit;
