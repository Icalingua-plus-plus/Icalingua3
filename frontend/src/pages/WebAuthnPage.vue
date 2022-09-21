<template>
  <AppContainer>
    <main class="flex flex-wrap gap-2 items-center">
      <div
        v-for="key in keys"
        :key="key.credentialID"
        class="text-sm flex flex-col shadow shadow-md p-4 rounded-md"
      >
        <div class="flex justify-center">
          <Icon size="32"><KeyOutlined /></Icon>
        </div>
        <p>ID：{{ key.credentialID.substring(0, 16) }}</p>
        <p>使用计数：{{ key.counter }}</p>
        <p>上次使用：{{ parseUnixTime(Math.floor(key.lastUsedAt / 1000)) }}</p>
        <div class="flex justify-center">
          <mwc-icon-button class="text-red-500" @click="() => handleDelete(key.credentialID)">
            <DeleteFilled />
          </mwc-icon-button>
        </div>
      </div>
      <mwc-icon-button v-if="!adding" class="text-green-400" @click="handleClick">
        <AddFilled />
      </mwc-icon-button>
      <mwc-circular-progress v-else indeterminate />
    </main>
  </AppContainer>
</template>
<script setup lang="ts">
import { IGetKeysRes } from '@icalingua/types/http/IGetKeysRes';
import parseUnixTime from '@icalingua/utils/parseUnixTime';
import '@material/mwc-icon-button';
import '@material/mwc-circular-progress/mwc-circular-progress';
import { AddFilled, DeleteFilled, KeyOutlined } from '@vicons/material';
import { Icon } from '@vicons/utils';
import { onMounted, ref } from 'vue';
import AppContainer from '../components/AppContainer.vue';
import { deleteKey, getKeys, register } from '../services/webAuthn';

const adding = ref(false);
const keys = ref<IGetKeysRes[]>();

/** 添加新密钥 */
const handleClick = async () => {
  adding.value = true;
  try {
    await register();
    keys.value = await getKeys();
  } catch (e) {
    console.error(e);
  }
  adding.value = false;
};

/** 删除密钥 */
const handleDelete = async (credentialID: string) => {
  await deleteKey(credentialID);
  keys.value = keys.value?.filter((key) => key.credentialID !== credentialID);
};

onMounted(async () => {
  keys.value = await getKeys();
});
</script>
