<template>
  <AppContainer>
    {{ data }}
    <JsonForms
      :data="data"
      :schema="(schema as unknown as JsonSchema)"
      :renderers="renderer"
      @change="handleChange"
    />
  </AppContainer>
</template>
<script setup lang="ts">
import schema from '@icalingua/types/IAppConfig';
import JsonSchema from '@icalingua/types/JsonSchema';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { ref } from 'vue';
import AppContainer from '../components/AppContainer.vue';

const renderer = Object.freeze(vanillaRenderers);
const data = ref({ qid: 0, password: '', protocol: 'iPad' });
/** 处理表单变化 */
const handleChange = (e: JsonFormsChangeEvent) => {
  data.value = e.data;
};
</script>
<style>
input.input {
  @apply border-solid rounded-md border-2 border-green-400 p-2;
}
label.label {
  @apply text-sm;
}
select.select {
  @apply p-4 border-solid rounded-md border-2 border-green-400 p-2 bg-transparent;
}

.horizontal-layout {
  @apply flex;
}

.vertical-layout {
  @apply flex flex-col;
}

.horizontal-layout-item,
.vertical-layout-item {
  @apply flex-grow;
}

.error {
  @apply text-sm text-red-400;
}

.control {
  display: flex;
  @apply flex flex-col;
}

.control > .wrapper {
  display: flex;
}

.control > .wrapper > input,
.control > .wrapper > select,
.control > .wrapper > textarea {
  flex: 1;
}

.control > .error,
.control > .description {
  min-height: 1.5em;
}
</style>
