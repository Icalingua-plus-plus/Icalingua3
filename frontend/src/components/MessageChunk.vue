<template>
  <MessageElement
    v-for="message in info.messages"
    :key="message.id"
    :message="(message as HTTPMessageItem)"
    :nickname="message.sender.nickname"
    :uin="message.sender.user_id"
  />
</template>
<script setup lang="ts">
import { IMessageRes, MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import MessageElement from './MessageElement.vue';

defineProps<{ info: IMessageRes }>();
</script>
