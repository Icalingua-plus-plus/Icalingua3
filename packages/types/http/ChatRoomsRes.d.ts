import type ChatRoom from '@icalingua/backend/src/database/entities/ChatRoom';

export interface ChatRoomsResItem extends ChatRoom {
  avatar: string | null;
}
