/* eslint-disable import/prefer-default-export */
import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { Message as OicqMessage, PrivateMessage, GroupMessage, DiscussMessage } from 'oicq';

/** 消息 */
@Entity()
@Index({ properties: ['seq', 'rand', 'time'] })
export class Message {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Index()
  @Property()
  roomId!: string;

  @Property()
  seq!: number;

  @Property()
  time!: number;

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
