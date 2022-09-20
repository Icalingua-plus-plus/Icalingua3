<template>
  <RouterLink
    v-if="res"
    :to="`/fwd/${res.resId}`"
    class="rounded-md bg-light-900 w-[fit-content] block p-2 text-xs"
  >
    <p v-for="content in res.content" :key="content">{{ content }}</p>
    <p class="text-sm">{{ res.summary }}</p>
  </RouterLink>
  <p v-else>XML not supported: {{ msg.data }}</p>
</template>
<script setup lang="ts">
import type { XmlElem } from 'oicq';
import getForwardMsg from '../../utils/getForwardMsg';

const props = defineProps<{ msg: XmlElem }>();
const res = getForwardMsg(props.msg.data);
</script>
