<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script setup lang="ts">
import type { ClientToServerEvents, ServerToClientEvents } from '@icalingua/types/socketIoTypes.js';
import { io, Socket } from 'socket.io-client';
import HelloWorld from './components/HelloWorld.vue';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('');
socket.on('newMessage', (e) => {
  console.log(e);
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
