<template>
  <AppContainer>
    <main class="flex flex-col gap-2">
      <div v-for="room in rooms" :key="room.roomId" class="flex gap-2 items-center">
        <div
          :style="{ 'background-image': `url(${room.avatar || defaultRoom})` }"
          class="h-16 w-16 bg-center bg-cover rounded-full flex-shrink-0"
          :alt="`Avatar of ${room.name}`"
        />
        <div class="flex flex-col flex-grow">
          <p class="text-lg">{{ room.name }}</p>
          <p class="text-gray-400 break-all">{{ room.lastMessage }}</p>
        </div>
        <p v-if="room.lastMessageTime" class="flex-shrink-0">
          {{ parseUnixTime(room.lastMessageTime) }}
        </p>
      </div>
    </main>
  </AppContainer>
</template>
<script setup lang="ts">
import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { ref, watchEffect } from 'vue';
import defaultRoom from '../assets/defaultRoom.png';
import AppContainer from '../components/AppContainer.vue';
import axiosClient from '../services/axiosClient';
import getChatRooms from '../services/getChatRooms';

const rooms = ref<ChatRoomsResItem[]>([]);
watchEffect(async () => {
  if (axiosClient.loggedIn) {
    rooms.value = await getChatRooms();
  }
});
</script>
