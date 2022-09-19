<template>
  <article ref="listRef" class="flex flex-col gap-2 h-full overflow-scroll">
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
        <div class="break-all">
          <MessageItem v-for="(msg, index) in message.message" :key="index.toString()" :msg="msg" />
        </div>
        <p class="text-gray-300 text-sm">{{ parseUnixTime(message.time) }}</p>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import { MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import RoomId from '@icalingua/types/RoomId';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { useScroll } from '@vueuse/core';
import debounce from 'lodash.debounce';
import { computed, ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import MessageItem from '../components/message/MessageItem.vue';
import useRR from '../hooks/useRR';
import clientSocket from '../services/ClientSocket';
import { getMessages } from '../services/messages';

const { route } = useRR();
const roomId = computed(() => route.params.roomId as RoomId);
const messages = ref<HTTPMessageItem[]>([]);
/** 聊天列表元素引用 */
const listRef = ref<HTMLDivElement>();
const { arrivedState } = useScroll(listRef);
clientSocket.onMessage.subscribe((msg) => {
  if (msg.roomId === roomId.value) messages.value.push(msg);
});
watchEffect(async () => {
  const res = await getMessages(roomId.value);
  console.log(res);
  messages.value = res.messages;
});
watchEffect(async () => {
  if (arrivedState.top && messages.value.length !== 0) {
    debounce(
      async () => {
        const res = await getMessages(roomId.value, { seqLte: messages.value[0].seq });
        console.log(res);
        messages.value = res.messages.concat(messages.value as HTTPMessageItem[]);
      },
      500,
      { trailing: true },
    )();
  }
});
</script>
