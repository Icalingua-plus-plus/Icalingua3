<template>
  <div class="rounded-md flex gap-2 items-start">
    <img
      :src="message.avatar || defaultRoom"
      class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12"
      :alt="`Avatar of ${nickname}`"
    />
    <div class="flex flex-col flex-grow shadow p-2">
      <p class="text-sm">{{ nickname }}</p>
      <div class="break-all">
        <MessageItem v-for="(msg, index) in message.message" :key="index.toString()" :msg="msg" />
      </div>
      <p class="text-sm text-gray-300">
        {{ parseUnixTime(message.time) }} {{ message.seq ? `#${message.seq}` : '' }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage';
import { MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import defaultRoom from '../assets/defaultRoom.png';
import MessageItem from './MessageItem/MessageItem.vue';

defineProps<{ message: HTTPForwardMessage | HTTPMessageItem; nickname: string }>();
</script>
