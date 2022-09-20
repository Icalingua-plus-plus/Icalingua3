<template>
  <AppContainer>
    {{ data }}
    <JsonForms
      :data="data"
      :schema="(schema as unknown as JsonSchema)"
      :renderers="renderer"
      @change="handleChange"
    />
    <button class="border-dashed rounded-md border-2 border-green-400 p-2" @click="handleSave">
      保存配置
    </button>
  </AppContainer>
</template>
<script setup lang="ts">
import schema, { IAppConfig } from '@icalingua/types/IAppConfig';
import JsonSchema from '@icalingua/types/JsonSchema';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { onMounted, ref } from 'vue';
import AppContainer from '../components/AppContainer.vue';
import { changeConfig, getConfig } from '../services/serverConfig';

const renderer = Object.freeze(vanillaRenderers);
const data = ref<IAppConfig>(
  (() => {
    const tempConfig = {} as unknown as IAppConfig;
    const keys = Object.keys(schema.properties) as unknown as (keyof typeof schema.properties)[];
    keys.forEach((key) => {
      tempConfig[key] = schema.properties[key].default as never;
    });
    return tempConfig;
  })(),
);
onMounted(async () => {
  data.value = await getConfig();
});
/** 处理表单变化 */
const handleChange = (e: JsonFormsChangeEvent) => {
  data.value = e.data;
};
/** 保存配置 */
const handleSave = async (e: MouseEvent) => {
  e.preventDefault();
  await changeConfig(data.value);
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
  @apply bg-transparent border-solid rounded-md border-2 border-green-400 p-4 p-2;
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
