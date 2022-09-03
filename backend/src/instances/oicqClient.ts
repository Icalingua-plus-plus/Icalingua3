import { Client, Config, DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq';
import { Observable } from 'rxjs';
import settings from '../settings.js';
import { oicqDataPath } from '../utils/pathUtils.js';

/** 用 rxjs 包装的 Client类 */
class ObservableClient extends Client {
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
  }

  /** 收到消息 */
  onMessage: Observable<PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent>;

  /** 登录成功 */
  onSystemOnline: Observable<void>;
}

const oicqClient = new ObservableClient(settings.qid, {
  platform: 2,
  data_dir: oicqDataPath,
});

export default oicqClient;
