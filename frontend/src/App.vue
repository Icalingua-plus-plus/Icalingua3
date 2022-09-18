<template>
  <AppHeader />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';

onMounted(() => {
  window.Notification.requestPermission();
});
</script>
<style>
:focus-visible {
  @apply outline-none;
}
</style>
