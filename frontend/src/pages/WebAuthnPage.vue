<template>
  <button @click="handleClick">test</button>
  <button @click="handleLogin">login</button>
</template>
<script setup lang="ts">
import { login, register } from '../services/webAuthn';

/** 测试 */
const handleClick = async () => {
  const res = await register();
  console.log(res);
};

/** ces */
const handleLogin = async () => {
  const res = await login();
  console.log(res);
};
</script>
