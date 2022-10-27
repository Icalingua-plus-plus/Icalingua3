import { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import { RoomId } from '@icalingua/types/RoomId';
import { ref, computed, watchEffect } from 'vue';
import { getChatRoom } from '../services/chatRoom';
import useRR from './useRR';

const { route } = useRR();
const roomId = computed(() => route.params.roomId as RoomId);
const roomInfo = ref<ChatRoomsResItem>();

/** 切换聊天室时的逻辑 */
watchEffect(async () => {
  if (!roomId.value) return;
  const roomRes = await getChatRoom(roomId.value);
  roomInfo.value = roomRes;
});

export default roomInfo;
