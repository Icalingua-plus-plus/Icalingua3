<template>
  <div ref="containerRef">
    <div v-if="show" class="flex flex-col gap-2">
      <MessageElement
        v-for="message in info.messages"
        :key="message.id"
        :message="(message as HTTPMessageItem)"
        :nickname="message.sender.nickname"
        :uin="message.sender.user_id"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { IMessageRes, MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import { useIntersectionObserver } from '@vueuse/core';
import { computed, ref } from 'vue';
import MessageElement from './MessageElement.vue';

const props = defineProps<{ info: IMessageRes }>();
const emit = defineEmits<{ (e: 'visible', id: number | null): void }>();
const containerRef = ref<HTMLDivElement>();
const show = ref(true);
const id = computed(() => props.info.currentChunk);
/** 滚动到当前元素 */
const scrollIntoView = () => {
  if (!containerRef.value) return;
  containerRef.value.scrollIntoView(true);
};
defineExpose({ show, id, scrollIntoView });
useIntersectionObserver(containerRef, ([{ isIntersecting }]) => {
  if (isIntersecting) emit('visible', id.value);
});
</script>
