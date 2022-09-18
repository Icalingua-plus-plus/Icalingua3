<template>
  <AppContainer>
    <h1 class="text-4xl text-center mb-2">Icalingua</h1>
    <form class="rounded border-2 border-dashed border-green-400 p-2 flex flex-col gap-2">
      <label class="flex items-center gap-2" for="address">
        地址<input
          id="address"
          v-model="formValue.address"
          class="p-2 flex-grow border-2 rounded"
          placeholder="可留空"
        />
      </label>
      <label class="flex items-center gap-2" for="key">
        密钥<textarea
          v-if="showKey"
          id="key"
          v-model="formValue.key"
          class="p-2 flex-grow border-2 rounded"
        />
        <textarea
          v-else
          id="key"
          class="p-2 flex-grow border-2 rounded"
          placeholder="如果你需要修改已保存的密钥，请点击这里"
          @click="
            showKey = true;
            formValue.key = '';
          "
        />
      </label>
      <div class="flex justify-center">
        <button class="px-2 py-1 border-2 rounded" @click="handleClick">登录</button>
      </div>
    </form>
  </AppContainer>
</template>
<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import useRR from '../hooks/useRR';
import axiosClient from '../services/axiosClient';
import clientSocket from '../services/ClientSocket';
import AppContainer from '../components/AppContainer.vue';

const { route, router } = useRR();
const formValue = useStorage('il-serverInfo', {
  address: '',
  key: '',
});
const showKey = ref(!formValue.value.key);
/** 登录按钮点击事件 */
const handleClick = async (e: MouseEvent) => {
  e.preventDefault();
  clientSocket.init(formValue.value.address, formValue.value.key);
  clientSocket.onMessage.subscribe((ev) => {
    console.log(ev);
    // eslint-disable-next-line no-new
    new Notification(ev.sender.nickname, {
      body: ev.raw_message,
    });
  });
  clientSocket.socket!.on('sendToken', (token) => {
    axiosClient.changeToken(token);
    router.push((route.query.to as string) || '/');
  });
};
</script>
