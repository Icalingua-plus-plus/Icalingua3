<template>
  <AppContainer>
    <main ref="listRef" class="flex flex-col gap-2 max-h-screen max-w-screen overflow-scroll">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex gap-2 items-start shadow rounded-md p-2"
      >
        <div
          :style="{ 'background-image': `url(${message.avatar || defaultRoom})` }"
          class="h-12 w-12 bg-center bg-cover rounded-full flex-shrink-0"
          :alt="`Avatar of ${message.sender.nickname}`"
        />
        <div class="flex flex-col flex-grow">
          <p class="text-sm">{{ message.sender.nickname }}</p>
          <p class="break-all">{{ message.raw_message }}</p>
          <p class="text-gray-300 text-sm">{{ parseUnixTime(message.time) }}</p>
        </div>
      </div>
    </main>
  </AppContainer>
</template>
<script setup lang="ts">
import { MessageItem } from '@icalingua/types/http/HTTPMessage';
import RoomId from '@icalingua/types/RoomId';
import calculateChunk from '@icalingua/utils/calculateChunk';
import parseRoomId from '@icalingua/utils/parseRoomId';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { useScroll } from '@vueuse/core';
import debounce from 'lodash.debounce';
import { onMounted, ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import AppContainer from '../components/AppContainer.vue';
import useRR from '../hooks/useRR';
import clientSocket from '../services/ClientSocket';
import { getMessages, getMessagesByChunk } from '../services/messages';

const { route } = useRR();
const { roomId } = route.params as { roomId: RoomId };
const messages = ref<MessageItem[]>([]);
/** 聊天列表元素引用 */
const listRef = ref<HTMLDivElement>();
const { arrivedState } = useScroll(listRef);
clientSocket.onMessage.subscribe((msg) => {
  if (msg.roomId === roomId) messages.value.push(msg);
});
onMounted(async () => {
  const res = await getMessages(roomId);
  console.log(res);
  messages.value = res.messages;
});
watchEffect(async () => {
  if (arrivedState.top && messages.value.length !== 0) {
    debounce(
      async () => {
        const { roomType } = parseRoomId(roomId);
        let res;
        if (roomType === 'private') {
          res = await getMessages(roomId, { seqLte: messages.value[0].seq });
        } else {
          res = await getMessagesByChunk(roomId, calculateChunk(messages.value[0].seq) - 1);
        }
        console.log(res);
        messages.value = res.messages.concat(messages.value as MessageItem[]);
      },
      500,
      { trailing: true },
    )();
  }
});
</script>
