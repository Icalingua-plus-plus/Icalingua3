<template>
  <AppContainer>
    <main class="flex gap-2 h-screen">
      <ul class="flex flex-col gap-2 flex-grow-1 flex-shrink-0 h-full w-[30%] overflow-scroll">
        <RouterLink
          v-for="room in rooms"
          :key="room.roomId"
          class="flex gap-2 items-center shadow rounded-md p-2"
          :to="`/${parseRoomId(room.roomId).roomType}/${room.roomId}`"
        >
          <div
            :style="{ 'background-image': `url(${room.avatar || defaultRoom})` }"
            class="h-16 w-16 bg-center bg-cover rounded-full flex-shrink-0"
            :alt="`Avatar of ${room.name}`"
          />
          <div class="flex flex-col flex-grow">
            <p class="text-lg">{{ room.name }}</p>
            <p class="text-gray-400 break-all">{{ room.lastMessage }}</p>
            <p v-if="room.lastMessageTime" class="text-gray-300 text-sm">
              {{ parseUnixTime(room.lastMessageTime) }}
            </p>
          </div>
        </RouterLink>
      </ul>
      <RouterView class="flex-grow-[2]" />
    </main>
  </AppContainer>
</template>
<script setup lang="ts">
import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import type RoomId from '@icalingua/types/RoomId';
import parseRoomId from '@icalingua/utils/parseRoomId';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { onMounted, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import defaultRoom from '../assets/defaultRoom.png';
import AppContainer from '../components/AppContainer.vue';
import axiosClient from '../services/axiosClient';
import getChatRooms, { getChatRoom } from '../services/chatRoom';
import clientSocket from '../services/ClientSocket';

const rooms = ref<ChatRoomsResItem[]>([]);
watchEffect(async () => {
  if (axiosClient.loggedIn) {
    rooms.value = await getChatRooms();
  }
});
onMounted(async () => {
  clientSocket.onMessage.subscribe(async (msg) => {
    let room;
    let roomId: RoomId;
    switch (msg.message_type) {
      case 'group':
        roomId = `group-${msg.group_id}`;
        break;
      case 'private':
        roomId = `private-${msg.sender.user_id}`;
        break;
      default:
        roomId = `discuss-${msg.discuss_id}`;
        break;
    }
    room = rooms.value.find((item) => item.roomId === roomId);
    if (room) {
      room.lastMessage = `${msg.sender.nickname}: ${msg.raw_message}`;
      room.lastMessageTime = msg.time;
      rooms.value.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
    } else {
      /** 这时数据库里的 room 是新的，不需要再获取 */
      room = await getChatRoom(roomId);
      rooms.value = [room, ...rooms.value];
    }
  });
});
</script>
