import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { Discuss, Friend, Group, User } from 'oicq';
import type RoomId from '@icalingua/types/RoomId.js';

/** 聊天室（包括私聊、群聊和讨论组） */
@Entity()
export default class ChatRoom {
  @PrimaryKey()
  @Property()
  @Index()
  roomId!: RoomId.default;

  @Property()
  name!: string;

  @Property()
  lastMessage?: string;

  @Property()
  @Index()
  lastMessageTime?: number;

  /** 从 0-5 共 6 级 */
  @Property()
  notiLevel!: number;

  constructor(item: Friend | Group | Discuss | User) {
    this.notiLevel = 5;
    if (item instanceof Friend) {
      this.roomId = `private-${item.uid}`;
      this.name = item.remark || item.nickname || `用户 ${item.uid}`;
    } else if (item instanceof Group) {
      this.roomId = `group-${item.gid}`;
      this.name = item.name || `群聊 ${item.gid}`;
    } else if (item instanceof User) {
      this.roomId = `private-${item.uid}`;
      this.name = `用户 ${item.uid}`;
    } else {
      this.roomId = `discuss-${item.gid}`;
      this.name = `讨论组 ${item.gid}`;
    }
  }
}
