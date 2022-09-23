<template>
  <div
    :id="`message-${(message as HTTPMessageItem).id || message.seq}`"
    :class="{
      'rounded-md': true,
      flex: true,
      'gap-2': true,
      'items-start': true,
      'justify-start': !myInfo || myInfo?.uin !== uin,
      'justify-end': myInfo?.uin === uin,
      'min-h-20': true,
    }"
  >
    <img
      v-if="!myInfo || myInfo?.uin !== uin"
      :src="message.avatar || defaultRoom"
      class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12"
      :alt="`Avatar of ${nickname}`"
    />
    <!--占位-->
    <div v-else class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12" />
    <div class="flex flex-col shadow p-2">
      <p class="text-sm">{{ nickname }}</p>
      <div class="break-all">
        <MessageItem v-for="(msg, index) in message.message" :key="index.toString()" :msg="msg" />
      </div>
      <p class="text-sm text-gray-300">
        {{ parseUnixTime(message.time) }} {{ message.seq ? `#${message.seq}` : '' }}
      </p>
    </div>
    <img
      v-if="myInfo?.uin === uin"
      :src="myInfo.avatar || defaultRoom"
      class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12"
      :alt="`Avatar of ${myInfo.nickname}`"
    />
    <!--占位-->
    <div v-else class="bg-center bg-cover rounded-full flex-shrink-0 h-12 w-12" />
  </div>
</template>
<script setup lang="ts">
import HTTPForwardMessage from '@icalingua/types/http/HTTPForwardMessage';
import { MessageItem as HTTPMessageItem } from '@icalingua/types/http/HTTPMessage';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import defaultRoom from '../assets/defaultRoom.png';
import MessageItem from './MessageItem/MessageItem.vue';
import { myInfo } from '../hooks/useMyInfo';

defineProps<{ message: HTTPForwardMessage | HTTPMessageItem; nickname: string; uin: number }>();
</script>
