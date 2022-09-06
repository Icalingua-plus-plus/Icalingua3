import { GroupMessage, PrivateMessage } from 'oicq';
import toast, { remove } from 'powertoast';
import { setTimeout } from 'timers/promises';
import oicqClient from '../instances/oicqClient.js';
import settings from '../settings.js';
import logger from '../utils/logger.js';

oicqClient
  .on('system.login.slider', () => {
    process.stdin.once('data', (ticket) => {
      oicqClient.submitSlider(String(ticket).trim());
    });
  })
  .login(settings.password);

oicqClient.onSystemOnline.subscribe(() => {
  logger.info('oicq logged in');
  oicqClient.emit('sync.message');
});

oicqClient.onMessage.subscribe(async (e) => {
  if (!settings.toast) return;
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
