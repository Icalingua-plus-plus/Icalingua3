/* eslint-disable import/prefer-default-export */
import { BigIntType, Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Message as OicqMessage, PrivateMessage, GroupMessage, DiscussMessage } from 'oicq';

/** 消息 */
@Entity()
@Unique({ properties: ['roomId', 'seq', 'rand', 'time'] })
export default class Message {
  @PrimaryKey({ autoincrement: true, type: BigIntType })
  id!: string;

  @Index()
  @Property()
  roomId!: string;

  @Index()
  @Property()
  seq!: number;

  @Index()
  @Property()
  time!: number;

  @Index()
  @Property()
  rand!: number;

  @Property()
  content!: Buffer;

  constructor(message: OicqMessage) {
    let roomId = '';
    if (message instanceof PrivateMessage) {
      roomId = `private-${message.sender.user_id}`;
    } else if (message instanceof GroupMessage) {
      roomId = `group-${message.group_id}`;
    } else {
      roomId = `discuss-${(message as DiscussMessage).discuss_id}`;
    }
    this.roomId = roomId;
    this.content = message.serialize();
    this.seq = message.seq;
    this.time = message.time;
    this.rand = message.rand;
  }
}
