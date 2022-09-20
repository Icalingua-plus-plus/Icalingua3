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
      <MessageElement
        v-for="message in messages"
        :key="message.id"
        :message="(message as HTTPMessageItem)"
        :nickname="message.sender.nickname"
      />
    </article>
  </div>
</template>
<script setup lang="ts">
import { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import { MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import RoomId from '@icalingua/types/RoomId';
import calculateChunk from '@icalingua/utils/calculateChunk';
import parseRoomId from '@icalingua/utils/parseRoomId';
import { useScroll } from '@vueuse/core';
import debounce from 'lodash.debounce';
import { computed, ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import MessageElement from '../components/MessageElement.vue';
import useRR from '../hooks/useRR';
import { getChatRoom } from '../services/chatRoom';
import clientSocket from '../services/ClientSocket';
import { getMessages, getMessagesByChunk } from '../services/messages';

const { route } = useRR();
const roomId = computed(() => route.params.roomId as RoomId);
const roomType = computed(() => {
  if (!roomId.value) return null;
  return parseRoomId(roomId.value).roomType;
});

const messages = ref<HTTPMessageItem[]>([]);
/** 聊天列表元素引用 */
const listRef = ref<HTMLDivElement>();
const { arrivedState } = useScroll(listRef);
const roomInfo = ref<ChatRoomsResItem>();

clientSocket.onMessage.subscribe((msg) => {
  if (msg.roomId === roomId.value) messages.value.push(msg);
});

watchEffect(async () => {
  if (!roomId.value) return;
  const [res, roomRes] = await Promise.all([getMessages(roomId.value), getChatRoom(roomId.value)]);
  console.log(res);
  messages.value = res.messages;
  roomInfo.value = roomRes;
});
watchEffect(async () => {
  if (!roomType.value) return;
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
