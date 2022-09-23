<template>
  <a :href="url" class="m-1 w-[fit-content] block" target="_blank" rel="noreferrer">
    <img
      :src="url"
      alt="Chat image"
      class="max-h-[30vh] max-w-[20vw] block"
      referrerpolicy="no-referrer"
    />
  </a>
</template>
<script setup lang="ts">
import type { BfaceElem } from 'oicq';
import { computed } from 'vue';

const props = defineProps<{ msg: BfaceElem }>();
const hash = computed(() => props.msg.file.substring(0, 32));
const shortHash = computed(() => hash.value.substring(0, 2));
const url = computed(
  () => `https://gxh.vip.qq.com/club/item/parcel/item/${shortHash.value}/${hash.value}/300x300.png`,
);
</script>
