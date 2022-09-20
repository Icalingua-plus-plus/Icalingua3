import type { ForwardMessage } from 'oicq';

export default interface HTTPForwardMessage extends ForwardMessage {
  avatar: string | null;
  /** 为了混过类型检查 */
  seq: null;
}
