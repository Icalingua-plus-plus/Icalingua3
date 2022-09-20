<template>
  <main
    class="flex-grow flex-shrink flex mx-auto max-w-sm my-0 min-h-0 p-4 gap-2 xl:max-w-[1280px]"
  >
    <ul class="flex flex-col h-full flex-grow-1 flex-shrink-0 w-[30%] gap-2 overflow-scroll">
      <li v-for="room in rooms" :key="room.roomId">
        <RouterLink
          class="rounded-md flex shadow max-w-[100%] p-2 gap-2 items-center"
          :to="`/chat/${room.roomId}`"
        >
          <img
            :src="room.avatar || defaultRoom"
            class="bg-center bg-cover rounded-full flex-shrink-0 h-16 w-16"
            :alt="`Avatar of ${room.name}`"
          />
          <div class="flex flex-col flex-grow flex-shrink min-w-0">
            <p>{{ room.name }}</p>
            <p class="text-sm text-gray-400 truncate break-all">
              {{ room.lastMessage }}
            </p>
            <p v-if="room.lastMessageTime" class="text-xs text-gray-300">
              {{ parseUnixTime(room.lastMessageTime) }}
            </p>
          </div>
        </RouterLink>
      </li>
    </ul>
    <!--这里放聊天内容-->
    <RouterView class="flex-grow-[2]" />
  </main>
</template>
<script setup lang="ts">
import type { ChatRoomsResItem } from '@icalingua/types/http/ChatRoomsRes';
import type { RoomId } from '@icalingua/types/RoomId';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import { onMounted, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import defaultRoom from '../assets/defaultRoom.png';
import { refreshMyInfo } from '../hooks/useMyInfo';
import axiosClient from '../services/axiosClient';
import getChatRooms, { getChatRoom } from '../services/chatRoom';
import clientSocket from '../services/ClientSocket';

const rooms = ref<ChatRoomsResItem[]>([]);
watchEffect(async () => {
  if (axiosClient.loggedIn) {
    rooms.value = await getChatRooms();
    await refreshMyInfo();
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
