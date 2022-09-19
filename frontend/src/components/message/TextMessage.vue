<template>
  <p class="break-all inline whitespace-pre-line text-ellipsis">{{ msg.text }}</p>
</template>
<script setup lang="ts">
defineProps<{ msg: { type: 'text'; text: string } }>();
</script>
