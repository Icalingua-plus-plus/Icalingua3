import { GroupMessage, PrivateMessage } from 'oicq';
import toast, { remove } from 'powertoast';
import { setTimeout } from 'timers/promises';
import ChatRoom from '../database/entities/ChatRoom.js';
import Message from '../database/entities/Message.js';
import { getEM } from '../database/storageProvider.js';
import logger from '../utils/logger.js';
import configProvider from './configProvider.js';
import type { ObservableClient } from './oicqClient.js';

/** 处理 oicq 消息
 * @param oicqClient oicq 实例
 */
const registerMessageHandler = (oicqClient: ObservableClient) => {
  oicqClient.onSystemOnline.subscribe(() => {
    logger.info('oicq logged in');
    oicqClient.emit('sync.message');
  });

  /** 把消息存数据库里 */
  oicqClient.onMessage.subscribe(async (e) => {
    const em = getEM();
    const message = new Message(e);
    const qb = em.qb(Message);
    /** Upsert，注意 roomId 在数据库里是 room_id */
    await qb.insert(message).onConflict(['room_id', 'seq', 'rand', 'time']).merge().execute();
    let chatRoom;
    if (e instanceof PrivateMessage) {
      chatRoom = new ChatRoom(e.friend);
    } else if (e instanceof GroupMessage) {
      chatRoom = new ChatRoom(e.group);
    } else {
      chatRoom = new ChatRoom(e.discuss);
    }
    chatRoom.lastMessage = `${e.sender.nickname}: ${e.raw_message}`;
    chatRoom.lastMessageTime = e.time;
    const rqb = em.qb(ChatRoom);
    /** Upsert，注意 roomId 在数据库里是 room_id */
    await rqb.insert(chatRoom).onConflict(['room_id']).merge().execute();
  });

  /** 输出调试信息 */
  oicqClient.onMessage.subscribe(async (e) => {
    logger.debug(JSON.stringify(e));
  });

  // 目前只搞了 Windows 的，POSIX 的以后再说
  // TODO: POSIX Toast
  oicqClient.onMessage.subscribe(async (e) => {
    if (!configProvider.config.toast) return;
    let group;
    let attribution;
    if (e instanceof PrivateMessage) {
      group = { id: e.sender.user_id.toString(), title: e.sender.nickname };
      attribution = '私聊消息';
    } else if (e instanceof GroupMessage) {
      group = { id: e.group_id.toString(), title: e.group_name };
      attribution = '群聊消息';
    } else {
      group = { id: e.discuss.group_id.toString(), title: e.discuss_name };
      attribution = '讨论组消息';
    }
    const uniqueID = `${e.seq}-${e.rand}`;
    try {
      await toast({
        title: e.sender.nickname,
        message: e.raw_message,
        group,
        attribution,
        uniqueID,
      });
      await setTimeout(60000);
      await remove('Microsoft.WindowsStore_8wekyb3d8bbwe!App', uniqueID);
    } catch (err) {
      logger.error(err);
    }
  });
};

export default registerMessageHandler;
