import type { EMessage } from '@icalingua/types/http/HTTPMessage.js';
import type RoomId from '@icalingua/types/RoomId.js';
import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { nanoid } from 'nanoid';

/** 消息 */
@Entity()
@Unique({ properties: ['roomId', 'seq', 'rand', 'time'] })
export default class Message {
  @PrimaryKey()
  id = nanoid();

  @Index()
  @Property()
  roomId!: RoomId.default;

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

  constructor(message: EMessage) {
    let roomId: RoomId.default;
    if (message.message_type === 'private') {
      roomId = `private-${message.sender.user_id}`;
    } else if (message.message_type === 'group') {
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
