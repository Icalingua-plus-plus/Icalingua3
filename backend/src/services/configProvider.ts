import type { IAppConfig } from '@icalingua/types/IAppConfig.js';
import schema from '@icalingua/types/IAppConfig.js';
import fs from 'node:fs/promises';
import logger from '../utils/logger.js';
import { configPath } from '../utils/pathUtils.js';

/** 配置管理 */
class ConfigProvider {
  /** 后端配置，按道理要可以在前端管理 */
  config: IAppConfig;

  constructor() {
    this.config = Object.fromEntries(
      Object.entries(schema.default.properties).map(([key, value]) => [
        key as unknown as (keyof typeof schema.default.properties)[],
        value.default as unknown as IAppConfig,
      ]),
    );
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
    try {
      const config = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(config);
    } catch (e) {
      logger.warn('Config not found. Using default config.');
    }
  }
}

const configProvider = new ConfigProvider();

export default configProvider;
