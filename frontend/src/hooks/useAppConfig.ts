import schema, { IAppConfig } from '@icalingua/types/IAppConfig';
import { JsonFormsChangeEvent } from '@jsonforms/vue';
import { ref, onMounted } from 'vue';
import { changeConfig, getConfig } from '../services/serverConfig';

export const appConfig = ref<IAppConfig>(
  (() => {
    const tempConfig = {} as unknown as IAppConfig;
    const keys = Object.keys(schema.properties) as unknown as (keyof typeof schema.properties)[];
    keys.forEach((key) => {
      tempConfig[key] = schema.properties[key].default as never;
    });
    return tempConfig;
  })(),
);

/** 管理 Icalingua 配置 */
const useAppConfig = () => {
  onMounted(async () => {
    appConfig.value = await getConfig();
  });
  /** 处理表单变化 */
  const handleChange = (e: JsonFormsChangeEvent) => {
    appConfig.value = e.data;
  };
  /** 保存配置 */
  const handleSave = async (e: MouseEvent) => {
    e.preventDefault();
    await changeConfig(appConfig.value);
  };
  return { handleChange, handleSave };
};

export default useAppConfig;
