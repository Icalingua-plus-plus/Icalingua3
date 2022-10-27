<template>
  <VVirtualList
    ref="listRef"
    :item-size="88"
    :items="messages"
    item-resizable
    key-field="id"
    @scroll="handleScroll"
  >
    <template #default="{ item }: { item: HTTPMessageItem }">
      <MessageElement
        :message="item"
        :nickname="item.sender.nickname"
        :uin="item.sender.user_id"
        class="min-h-20"
      />
    </template>
  </VVirtualList>
</template>
<script setup lang="ts">
import { IMessageRes, MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import { RoomId } from '@icalingua/types/RoomId';
import parseRoomId from '@icalingua/utils/parseRoomId';
import debounce from 'lodash.debounce';
import uniqBy from 'lodash.uniqby';
import { computed, nextTick, reactive, ref, watch, watchEffect } from 'vue';
import { VVirtualList } from 'vueuc';
import useRR from '../hooks/useRR';
import clientSocket from '../services/ClientSocket';
import { getMessages, getMessagesByChunk } from '../services/messages';
import MessageElement from './MessageElement.vue';

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

/** 消息列表引用 */
const listRef = ref<InstanceType<typeof VVirtualList>>();

const fetchOlderMessages = debounce(
  async () => {
    const res = await getMessagesByChunk(roomId.value, chunksRes.value[0].lastChunk!);
    if (res.currentChunk === null) return;
    chunksRes.value = uniqBy([res].concat(chunksRes.value as IMessageRes[]), (a) => a.currentChunk);
    await nextTick();
    listRef.value?.scrollTo({ index: 20 });
  },
  500,
  { trailing: true },
);

/** 切换聊天室时的逻辑 */
watchEffect(async () => {
  if (!roomId.value) return;
  const res = await getMessages(roomId.value);
  chunksRes.value = [res];
  newMessages.value = [];
  await fetchOlderMessages();
});

/** 消息列表滚动到顶时的逻辑 */
watch(scrollState, async () => {
  /** 当前页面不是聊天页面时 */
  if (!roomType.value) return;
  /** 列表还没加载好时 */
  if (!listRef.value) return;
  /** 列表还没初始化时 */
  if (chunksRes.value.length === 0) return;
  if (!chunksRes.value[0].lastChunk) return;
  /** 列表滚动到最顶，触发更新 */
  if (scrollState.arrivedTop) {
    await fetchOlderMessages();
  }
});
</script>
