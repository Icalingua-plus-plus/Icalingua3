<template>
  <article class="flex flex-col h-full gap-2 overflow-scroll">
    <button @click="router.back()">返回</button>
    <MessageElement
      v-for="(message, index) in messages"
      :key="index.toString()"
      :message="message"
      :nickname="message.nickname"
      :uin="message.user_id"
    />
  </article>
</template>
<script setup lang="ts">
import HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage';
import { computed, ref, watchEffect } from 'vue';
import MessageElement from '../components/MessageElement.vue';
import useRR from '../hooks/useRR';
import { getForwardMsg } from '../services/messages';

const messages = ref<HTTPForwardMessage[]>();
const { route, router } = useRR();
const resId = computed(() => (route.params as { resId: string }).resId);
watchEffect(async () => {
  if (!resId.value) return;
  messages.value = await getForwardMsg(encodeURIComponent(resId.value));
});
</script>
