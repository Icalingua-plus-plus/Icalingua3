<template>
  <a :href="msg.url" class="m-1 w-[fit-content] block" target="_blank" rel="noreferrer">
    <img
      :src="msg.url"
      alt="Chat image"
      class="max-h-[30vh] max-w-[20vw] block"
      referrerpolicy="no-referrer"
    />
  </a>
</template>
<script setup lang="ts">
import type { ImageElem } from 'oicq';

defineProps<{ msg: ImageElem }>();
</script>
