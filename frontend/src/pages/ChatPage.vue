<template>
  <AppContainer>
    <main class="flex flex-col gap-2">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex gap-2 items-start shadow rounded-md p-2"
      >
        <div
          :style="{ 'background-image': `url(${message.avatar || defaultRoom})` }"
          class="h-12 w-12 bg-center bg-cover rounded-full flex-shrink-0"
          :alt="`Avatar of ${message.sender.nickname}`"
        />
        <div class="flex flex-col flex-grow">
          <p class="text-sm">{{ message.sender.nickname }}</p>
          <p class="break-all">{{ message.raw_message }}</p>
          <p class="text-gray-300 text-sm">{{ parseUnixTime(message.time) }}</p>
        </div>
      </div>
    </main>
  </AppContainer>
</template>
<script setup lang="ts">
import { MessageItem } from '@icalingua/types/http/HTTPMessage';
import RoomId from '@icalingua/types/RoomId';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import AppContainer from '../components/AppContainer.vue';
import useRR from '../hooks/useRR';
import { getMessages } from '../services/messages';

const { route } = useRR();
const messages = ref<MessageItem[]>([]);
watchEffect(async () => {
  const { roomId } = route.params as { roomId: RoomId };
  const res = await getMessages(roomId);
  console.log(res);
  messages.value = res.messages;
});
</script>
