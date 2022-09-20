import type { ForwardMessage } from 'oicq';

export default interface HTTPForwardMessage extends ForwardMessage {
  avatar: string | null;
}
