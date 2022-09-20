<template>
  <p class="break-all">{{ msg.type }} not implemented: {{ JSON.stringify(msg) }}</p>
</template>
<script setup lang="ts">
import type { MessageElem } from 'oicq';

defineProps<{ msg: MessageElem }>();
</script>
