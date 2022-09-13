/* eslint-disable import/prefer-default-export */
import { BigIntType, Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { PrivateMessage, GroupMessage, DiscussMessage } from 'oicq';

/** 消息 */
@Entity()
@Unique({ properties: ['roomId', 'seq', 'rand', 'time'] })
export default class Message {
  @PrimaryKey({ autoincrement: true, type: BigIntType, unsigned: true })
  id!: string;

  @Index()
  @Property()
  roomId!: string;

  @Index()
  @Property({ unsigned: true })
  seq!: number;

  @Index()
  @Property({ unsigned: true })
  time!: number;

  @Index()
  @Property({ unsigned: true })
  rand!: number;

  /** 艾特全体 */
  @Index()
  @Property({ default: false })
  atall = false;

  /** 艾特我 */
  @Index()
  @Property({ default: false })
  atme = false;

  /** 已经确认了艾特 */
  @Property({ default: true })
  confirmed = true;

  @Property()
  content!: Buffer;

  constructor(message: PrivateMessage | GroupMessage | DiscussMessage) {
    this.update(message);
  }

  /** 更新当前实例 */
  update(message: PrivateMessage | GroupMessage | DiscussMessage) {
    let roomId = '';
    if (message instanceof PrivateMessage) {
      roomId = `private-${message.sender.user_id}`;
    } else if (message instanceof GroupMessage) {
      roomId = `group-${message.group_id}`;
      this.atall = !!message.atall;
      this.atme = !!message.atme;
      this.confirmed = !message.atall && !message.atme;
    } else {
      roomId = `discuss-${message.discuss_id}`;
      this.atme = !!message.atme;
      this.confirmed = !message.atme;
    }
    this.roomId = roomId;
    this.content = message.serialize();
    this.seq = message.seq;
    this.time = message.time;
    this.rand = message.rand;
  }
}
