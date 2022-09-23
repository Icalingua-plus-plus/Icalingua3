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
    <VVirtualList :item-size="80" :items="messages" item-resizable @scroll="handleScroll">
      <template #default="{ item }: { item: HTTPMessageItem }">
        <MessageElement
          :message="item"
          :nickname="item.sender.nickname"
          :uin="item.sender.user_id"
        />
      </template>
    </VVirtualList>
  </div>
</template>
<script setup lang="ts">
import { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import { IMessageRes, MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import { RoomId } from '@icalingua/types/RoomId';
import parseRoomId from '@icalingua/utils/parseRoomId';
import debounce from 'lodash.debounce';
import uniqBy from 'lodash.uniqby';
import { computed, nextTick, reactive, ref, watchEffect } from 'vue';
import { VVirtualList } from 'vueuc';
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

const chunksRes = ref<IMessageRes[]>([]);
const newMessages = ref<HTTPMessageItem[]>([]);
const messages = computed(() =>
  chunksRes.value.flatMap((chunk) => chunk.messages).concat(newMessages.value),
);
const scrollState = reactive({ arrivedTop: false });
const roomInfo = ref<ChatRoomsResItem>();
/** 滚动事件 */
const handleScroll = (e: Event) => {
  const { scrollTop } = e.target as HTMLDivElement;
  if (scrollTop === 0) {
    scrollState.arrivedTop = true;
  } else {
    scrollState.arrivedTop = false;
  }
};

clientSocket.onMessage.subscribe((msg) => {
  if (msg.roomId === roomId.value) newMessages.value.push(msg);
});

/** 切换聊天室时的逻辑 */
watchEffect(async () => {
  if (!roomId.value) return;
  const [res, roomRes] = await Promise.all([getMessages(roomId.value), getChatRoom(roomId.value)]);
  console.log(res);
  chunksRes.value = [res];
  roomInfo.value = roomRes;
  newMessages.value = [];
});
const loading = ref(false);
watchEffect(async () => {
  if (loading.value) return;
  if (!roomType.value) return;
  if (scrollState.arrivedTop && chunksRes.value.length !== 0 && chunksRes.value[0].lastChunk) {
    debounce(
      async () => {
        if (loading.value) return;
        const res = await getMessagesByChunk(roomId.value, chunksRes.value[0].lastChunk!);
        console.log(res);
        if (res.currentChunk === null) return;
        chunksRes.value = uniqBy(
          [res].concat(chunksRes.value as IMessageRes[]),
          (a) => a.currentChunk,
        );
        await nextTick();
      },
      500,
      { trailing: true },
    )();
  }
});
</script>
