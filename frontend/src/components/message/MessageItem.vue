<template><component :is="elemToComponent[msg.type]" :msg="msg" /></template>
<script setup lang="ts">
import type { MessageElem } from 'oicq';
import type { Component } from 'vue';
import AtMessage from './AtMessage.vue';
import BFaceMessage from './BFaceMessage.vue';
import ImgMessage from './ImgMessage.vue';
import NotSupportMessage from './NotSupportMessage.vue';
import TextMessage from './TextMessage.vue';
import XmlMessage from './XmlMessage.vue';

defineProps<{ msg: MessageElem }>();
const elemToComponent: Record<MessageElem['type'], Component> = {
  at: AtMessage,
  file: NotSupportMessage,
  text: TextMessage,
  face: NotSupportMessage,
  sface: NotSupportMessage,
  bface: BFaceMessage,
  rps: NotSupportMessage,
  dice: NotSupportMessage,
  image: ImgMessage,
  mirai: NotSupportMessage,
  reply: NotSupportMessage,
  flash: NotSupportMessage,
  record: NotSupportMessage,
  video: NotSupportMessage,
  json: NotSupportMessage,
  xml: XmlMessage,
  poke: NotSupportMessage,
  location: NotSupportMessage,
  share: NotSupportMessage,
};
</script>
