<template>
  <AppContainer>
    <h1 class="text-4xl text-center mb-2">Icalingua</h1>
    <form class="rounded border-2 border-dashed border-green-400 p-2 flex flex-col gap-2">
      <label class="flex items-center gap-2" for="address">
        地址<input
          id="address"
          v-model="address"
          class="p-2 flex-grow border-2 rounded"
          placeholder="可留空"
        />
      </label>
      <label class="flex items-center gap-2 sm:min-w-sm" for="key">
        密码<input
          v-if="showKey"
          id="key"
          v-model="password"
          class="p-2 flex-grow border-2 rounded"
          placeholder="初次登录相当于注册"
          type="password"
        />
        <input
          v-else
          id="key"
          class="p-2 flex-grow border-2 rounded"
          placeholder="如果你需要修改已保存的密码，请点击这里"
          @click="showKey = true"
        />
      </label>
      <div class="flex justify-center gap-2">
        <button class="px-2 py-1 border-2 rounded" @click="handleClick">登录</button>
        <button class="px-2 py-1 border-2 rounded" @click="handleWebAuthn">WebAuthn</button>
      </div>
    </form>
  </AppContainer>
</template>
<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { AxiosError } from 'axios';
import { ref } from 'vue';
import AppContainer from '../components/AppContainer.vue';
import useRR from '../hooks/useRR';
import axiosClient from '../services/axiosClient';
import clientSocket from '../services/ClientSocket';
import { login } from '../services/webAuthn';

const { route, router } = useRR();
const address = useStorage('il-serverAddress', '');
const token = useStorage('il-token', '');
const password = ref('');
const showKey = ref(!token.value);
/** 登录后的工作 */
const afterLogin = () => {
  clientSocket.onMessage.subscribe((ev) => {
    console.log(ev);
    // eslint-disable-next-line no-new
    new Notification(ev.sender.nickname, {
      body: ev.raw_message,
    });
  });
  router.push((route.query.to as string) || '/');
};
/** 登录按钮点击事件 */
const handleClick = async (e: MouseEvent) => {
  e.preventDefault();
  try {
    if (token.value && !password.value) {
      await axiosClient.changeToken(token.value);
      clientSocket.init(address.value, token.value);
    } else {
      const res = await axiosClient.login(password.value);
      token.value = res;
      clientSocket.init(address.value, res);
    }
    afterLogin();
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      alert(err.response.data);
    }
  }
};
/** 通过 WebAuthn 登录 */
const handleWebAuthn = async (e: MouseEvent) => {
  e.preventDefault();
  try {
    const res = await login();
    await axiosClient.changeToken(res);
    clientSocket.init(address.value, res);
    afterLogin();
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      alert(err.response.data);
    }
  }
};
</script>
