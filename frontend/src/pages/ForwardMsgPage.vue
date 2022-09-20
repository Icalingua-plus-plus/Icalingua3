<template>
  <article class="flex flex-col h-full gap-2 overflow-scroll">
    <button @click="router.back()">返回</button>
    <div
      v-for="(message, index) in messages"
      :key="index.toString()"
      class="rounded-md flex gap-2 items-start"
    >
      <img
        :src="message.avatar || defaultRoom"
        class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12"
        :alt="`Avatar of ${message.nickname}`"
      />
      <div class="flex flex-col flex-grow shadow p-2">
        <p class="text-sm">{{ message.nickname }}</p>
        <div class="break-all">
          <MessageItem v-for="msg in message.message" :key="JSON.stringify(msg)" :msg="msg" />
        </div>
        <p class="text-sm text-gray-300">{{ parseUnixTime(message.time) }}</p>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { computed, ref, watchEffect } from 'vue';
import MessageItem from '../components/message/MessageItem.vue';
import useRR from '../hooks/useRR';
import { getForwardMsg } from '../services/messages';
import defaultRoom from '../assets/defaultRoom.png';

const messages = ref<HTTPForwardMessage[]>();
const { route, router } = useRR();
const resId = computed(() => (route.params as { resId: string }).resId);
watchEffect(async () => {
  if (!resId.value) return;
  messages.value = await getForwardMsg(resId.value);
});
</script>
