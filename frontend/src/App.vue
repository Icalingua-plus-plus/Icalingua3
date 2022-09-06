<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  window.Notification.requestPermission();
});
</script>
<style>
:focus-visible {
  @apply outline-none;
}
</style>
