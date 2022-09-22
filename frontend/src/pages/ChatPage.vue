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
    <article ref="listRef" class="flex flex-col h-full gap-2 overflow-scroll overflow-x-hidden">
      <!--完成滚动逻辑之后再改成 chunksToDisplay-->
      <MessageChunk
        v-for="info in chunksRes"
        :id="`chunk-${info.currentChunk}`"
        ref="chunksRef"
        :key="info.currentChunk || 0"
        :info="(info as IMessageRes)"
        @visible="onVisible"
      />
      <MessageElement
        v-for="message in newMessages"
        :key="message.id"
        :message="(message as HTTPMessageItem)"
        :nickname="message.sender.nickname"
        :uin="message.sender.user_id"
      />
    </article>
  </div>
</template>
<script setup lang="ts">
import { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import { IMessageRes, MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import { RoomId } from '@icalingua/types/RoomId';
import parseRoomId from '@icalingua/utils/parseRoomId';
import { useScroll } from '@vueuse/core';
import debounce from 'lodash.debounce';
import uniqBy from 'lodash.uniqby';
import { computed, ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import MessageChunk from '../components/MessageChunk.vue';
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

const chunksRes = ref<IMessageRes[]>([]);
const newMessages = ref<HTTPMessageItem[]>([]);
/** 聊天列表元素引用 */
const listRef = ref<HTMLDivElement>();
const chunksRef = ref<InstanceType<typeof MessageChunk>[]>([]);
const { arrivedState } = useScroll(listRef);
const roomInfo = ref<ChatRoomsResItem>();
/** 当前可见的 chunk */
const currentVisible = ref(0);
/*
const chunksToDisplay = computed(() =>
  chunksRes.value.filter(
    (chunk) =>
      chunk.currentChunk! >= currentVisible.value - 1 &&
      chunk.currentChunk! <= currentVisible.value + 1,
  ),
);
*/

clientSocket.onMessage.subscribe((msg) => {
  if (msg.roomId === roomId.value) newMessages.value.push(msg);
});

/** chunk 可见时触发的事件 */
const onVisible = (id: number | null) => {
  if (id === null) return;
  currentVisible.value = id;
};

/** 切换聊天室时的逻辑 */
watchEffect(async () => {
  if (!roomId.value) return;
  const [res, roomRes] = await Promise.all([getMessages(roomId.value), getChatRoom(roomId.value)]);
  console.log(res);
  chunksRes.value = [res];
  currentVisible.value = res.currentChunk || 0;
  roomInfo.value = roomRes;
  newMessages.value = [];
});

watchEffect(async () => {
  if (!roomType.value) return;
  if (arrivedState.top && chunksRes.value.length !== 0 && chunksRes.value[0].lastChunk) {
    debounce(
      async () => {
        const res = await getMessagesByChunk(roomId.value, chunksRes.value[0].lastChunk!);
        console.log(res);
        if (res.currentChunk === null) return;
        chunksRes.value = uniqBy(
          [res].concat(chunksRes.value as IMessageRes[]),
          (a) => a.currentChunk,
        );
      },
      500,
      { trailing: true },
    )();
  }
});
</script>
