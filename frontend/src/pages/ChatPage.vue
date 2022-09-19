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
    <article ref="listRef" class="flex flex-col h-full gap-2 overflow-scroll">
      <div v-for="message in messages" :key="message.id" class="rounded-md flex gap-2 items-start">
        <img
          :src="message.avatar || defaultRoom"
          class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12"
          :alt="`Avatar of ${message.sender.nickname}`"
        />
        <div class="flex flex-col flex-grow shadow p-2">
          <p class="text-sm">{{ message.sender.nickname }}</p>
          <div class="break-all">
            <MessageItem
              v-for="(msg, index) in message.message"
              :key="index.toString()"
              :msg="msg"
            />
          </div>
          <p class="text-sm text-gray-300">{{ parseUnixTime(message.time) }}</p>
        </div>
      </div>
    </article>
  </div>
</template>
<script setup lang="ts">
import { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import { MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import RoomId from '@icalingua/types/RoomId';
import calculateChunk from '@icalingua/utils/calculateChunk';
import parseRoomId from '@icalingua/utils/parseRoomId';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { useScroll } from '@vueuse/core';
import debounce from 'lodash.debounce';
import { computed, ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import MessageItem from '../components/message/MessageItem.vue';
import useRR from '../hooks/useRR';
import { getChatRoom } from '../services/chatRoom';
import clientSocket from '../services/ClientSocket';
import { getMessages, getMessagesByChunk } from '../services/messages';

const { route } = useRR();
const roomId = computed(() => route.params.roomId as RoomId);
const roomType = computed(() => parseRoomId(roomId.value).roomType);

const messages = ref<HTTPMessageItem[]>([]);
/** 聊天列表元素引用 */
const listRef = ref<HTMLDivElement>();
const { arrivedState } = useScroll(listRef);
const roomInfo = ref<ChatRoomsResItem>();

clientSocket.onMessage.subscribe((msg) => {
  if (msg.roomId === roomId.value) messages.value.push(msg);
});

watchEffect(async () => {
  const [res, roomRes] = await Promise.all([getMessages(roomId.value), getChatRoom(roomId.value)]);
  console.log(res);
  messages.value = res.messages;
  roomInfo.value = roomRes;
});
watchEffect(async () => {
  if (arrivedState.top && messages.value.length !== 0) {
    debounce(
      async () => {
        let res;
        if (roomType.value !== 'private') {
          res = await getMessagesByChunk(roomId.value, calculateChunk(messages.value[0].seq) - 1);
        } else {
          res = await getMessages(roomId.value, { seqLte: messages.value[0].seq });
        }
        console.log(res);
        messages.value = res.messages.concat(messages.value as HTTPMessageItem[]);
      },
      500,
      { trailing: true },
    )();
  }
});
</script>
