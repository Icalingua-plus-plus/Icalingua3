<template>
  <div class="flex flex-col">
    <h1 class="rounded-md bg-light-200 p-2">
      <img
        :src="roomInfo?.avatar || defaultRoom"
        :alt="`Avatar of ${roomInfo?.name}`"
        class="rounded-full h-12 w-12 inline"
      />
      {{ roomInfo?.name }}
    </h1>
    <ChatList />
    <form @submit.prevent="handleSend">
      <input v-model="msgOnSend" />
    </form>
  </div>
</template>
<script setup lang="ts">
import { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import { RoomId } from '@icalingua/types/RoomId';
import { computed, ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import ChatList from '../components/ChatList.vue';
import useRR from '../hooks/useRR';
import { getChatRoom } from '../services/chatRoom';
import { sendMsg } from '../services/messages';

const { route } = useRR();
const roomId = computed(() => route.params.roomId as RoomId);
const roomInfo = ref<ChatRoomsResItem>();
const msgOnSend = ref('');
/** 发送消息 */
const handleSend = async () => {
  await sendMsg(roomId.value, [{ type: 'text', text: msgOnSend.value }]);
  msgOnSend.value = '';
};

/** 切换聊天室时的逻辑 */
watchEffect(async () => {
  if (!roomId.value) return;
  const roomRes = await getChatRoom(roomId.value);
  roomInfo.value = roomRes;
});
</script>
