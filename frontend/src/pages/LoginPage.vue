<template>
  <main class="block max-w-sm lg:max-w-[1280px] p-4 my-0 mx-auto">
    <h1 class="text-4xl text-center mb-2">Icalingua</h1>
    <form class="rounded border-2 border-dashed border-green-400 p-2 flex flex-col gap-2">
      <label class="flex items-center gap-2" for="address">
        地址<input
          id="address"
          v-model="formValue.address"
          class="p-2 flex-grow border-2 rounded"
        />
      </label>
      <label class="flex items-center gap-2" for="key">
        密钥<textarea
          id="key"
          v-model="formValue.key"
          class="p-2 flex-grow border-2 rounded outline-none"
        />
      </label>
      <div class="flex justify-center">
        <button class="px-2 py-1 border-2 rounded outline-none" @click="handleClick">登录</button>
      </div>
    </form>
  </main>
</template>
<script setup lang="ts">
import type { ClientToServerEvents, ServerToClientEvents } from '@icalingua/types/socketIoTypes';
import { useStorage } from '@vueuse/core';
import { io, Socket } from 'socket.io-client';
import signChallenge from '../utils/signChallenge';

const formValue = useStorage('il-serverInfo', {
  address: '',
  key: '',
});
const handleClick = async (e: MouseEvent) => {
  e.preventDefault();
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(formValue.value.address, {
    transports: ['websocket'],
  });
  socket.once('challenge', async (ev) => {
    const signature = await signChallenge(ev, formValue.value.key);
    socket.emit('verify', signature);
  });
  socket.on('newMessage', (ev) => {
    console.log(ev);
  });
};
</script>
