import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes.js';
import type IMyInfo from '@icalingua/types/http/IMyInfo.js';
import { IAppConfig } from '@icalingua/types/IAppConfig.js';
import type { RoomId } from '@icalingua/types/RoomId.js';
import parseRoomId from '@icalingua/utils/parseRoomId.js';
import { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';
import ChatRoom from '../database/entities/ChatRoom.js';
import { roomParse } from '../database/parser.js';
import { getEM } from '../database/storageProvider.js';
import needAuth from '../plugins/needAuth.js';
import configProvider from '../services/configProvider.js';
import { getOicqClient } from '../services/oicqClient.js';
import passwordSecretUtils from '../utils/passwordSecretUtils.js';
import corsRouter from './corsRouter.js';
import messagesRouter from './messagesRouter.js';
import webAuthnRouter from './webAuthnRouter.js';

/** `/api` 路由，但是需要用户登录 */
const protectedRouter = async (server: FastifyInstance) => {
  server.register(needAuth);
  /** 用于检测当前的 token 是否有效 */
  server.get('/verify', async (req, res) => {
    res.send('OK');
  });
  /** 获取聊天室列表 */
  server.get('/chatRooms', async (req, res) => {
    const rooms = await getEM().find(ChatRoom, {}, { orderBy: { lastMessageTime: 'DESC' } });
    const data: ChatRoomsResItem[] = rooms.map(roomParse);
    res.send(data);
  });
  /** 获取单个聊天室信息 */
  server.get<{ Params: { roomId: RoomId } }>('/chatroom/:roomId', async (req, res) => {
    const oicqClient = getOicqClient();
    if (!oicqClient) return res.status(500).send('oicqClient is not ready');
    const { roomId } = req.params;
    let room = await getEM().findOne(ChatRoom, { roomId });
    /** 如果数据库里没有 room，则新建一个 */
    if (!room) {
      const { roomType, id } = parseRoomId(roomId);
      switch (roomType) {
        case 'group':
          room = new ChatRoom(oicqClient.pickGroup(id));
          break;
        case 'discuss':
          room = new ChatRoom(oicqClient.pickDiscuss(id));
          break;
        default:
          room = new ChatRoom(oicqClient.pickFriend(id));
      }
      /** 有可能会脏查询和 Conflict，等遇到这个情况再换成 upsert 之类的 */
      await getEM().persistAndFlush(room);
    }
    return res.send(roomParse(room));
  });
  /** 获取我的信息 */
  server.get('/myInfo', async (req, res) => {
    const oicqClient = getOicqClient();
    if (!oicqClient) return res.code(500).send('OicqClient is not ready');
    const user = oicqClient.pickUser(oicqClient.uin);
    const data: IMyInfo.default = {
      uin: oicqClient.uin,
      avatar: user.getAvatarUrl(),
      nickname: oicqClient.nickname,
    };
    return res.send(data);
  });
  /** 修改服务端配置 */
  server.post<{ Body: IAppConfig }>('/config', async (req, res) => {
    const newConfig = req.body;
    configProvider.setConfig(newConfig);
    await configProvider.saveConfig();
    res.code(201).send('Created');
  });
  /** 获取服务端配置 */
  server.get('/config', async (req, res) => {
    res.send(configProvider.config);
  });
  /** 退出登录 */
  server.delete('/logout', async (req, res) => {
    await passwordSecretUtils.logout();
    res.code(204).send('Logged out');
  });
  server.register(messagesRouter, { prefix: '/messages' });
};

/** `/api` 路由 */
const apiRouter = async (server: FastifyInstance) => {
  server.register(corsRouter, { prefix: '/cors' });
  server.register(webAuthnRouter, { prefix: '/webauthn' });
  server.register(protectedRouter);
  server.post<{ Body: { password: string } }>('/login', async (req, res) => {
    const isValid = await passwordSecretUtils.verifyPasssword(req.body.password);
    if (!isValid) return res.status(401).send('Unauthorized');
    const token = server.jwt.sign({ id: nanoid() });
    return res.send(token);
  });
};

export default apiRouter;
