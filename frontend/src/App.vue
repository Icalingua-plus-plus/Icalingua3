<template>
  <RouterView />
</template>

<script setup lang="ts">
import type { ClientToServerEvents, ServerToClientEvents } from '@icalingua/types/socketIoTypes.js';
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('', {
  transports: ['websocket'],
});
socket.on('newMessage', (e) => {
  console.log(e);
});
</script>
