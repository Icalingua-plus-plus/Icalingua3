<template>
  <main class="block max-w-sm lg:max-w-[1280px] p-4 my-0 mx-auto">
    <h1 class="text-4xl text-center mb-2">Icalingua</h1>
    <form class="rounded border-2 border-dashed border-green-400 p-2 flex flex-col gap-2">
      <label class="flex items-center gap-2" for="address">
        地址<input id="address" v-model="formValue.address" class="p-2 flex-grow" />
      </label>
      <label class="flex items-center gap-2" for="key">
        密钥<textarea id="key" v-model="formValue.key" class="p-2 flex-grow font-mono" />
      </label>
      <div class="flex justify-center">
        <button @click="handleClick">登录</button>
      </div>
    </form>
  </main>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

const formValue = reactive({
  address: '',
  key: '',
});
const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};
</script>
