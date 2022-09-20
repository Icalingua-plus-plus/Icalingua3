<template>
  <p class="inline">{{ msg.text }}</p>
</template>
<script setup lang="ts">
import type { AtElem } from 'oicq';

defineProps<{ msg: AtElem }>();
</script>
