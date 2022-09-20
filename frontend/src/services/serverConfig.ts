import { IAppConfig } from '@icalingua/types/IAppConfig';
import axiosClient from './axiosClient';

/** 修改服务端配置 */
export const changeConfig = async (newConfig: IAppConfig) => {
  const res = await axiosClient.client.post('/config', newConfig);
  return res.status <= 399;
};

/** 获取服务端配置 */
export const getConfig = async () => {
  const res = await axiosClient.client.get<IAppConfig>('./config');
  return res.data;
};
