import type { IAppConfig } from '@icalingua/types/IAppConfig.js';
import schema from '@icalingua/types/IAppConfig.js';
import fs from 'node:fs/promises';
import { configPath } from '../utils/pathUtils.js';

/** 配置管理 */
class ConfigProvider {
  /** 后端配置，按道理要可以在前端管理 */
  config: IAppConfig;

  constructor() {
    // 在这里用了一堆类型魔法，罪过罪过
    this.config = (() => {
      const tempConfig = {} as unknown as IAppConfig;
      const keys = Object.keys(
        schema.default.properties,
      ) as unknown as (keyof typeof schema.default.properties)[];
      keys.forEach((key) => {
        tempConfig[key] = schema.default.properties[key].default as never;
      });
      return tempConfig;
    })();
  }

  /** 替换 config 对象 */
  setConfig(newConfig: IAppConfig) {
    this.config = newConfig;
  }

  /** 保存配置 */
  async saveConfig() {
    await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
  }

  /** 读取配置 */
  async loadConfig() {
    const config = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(config);
  }
}

const configProvider = new ConfigProvider();

export default configProvider;
