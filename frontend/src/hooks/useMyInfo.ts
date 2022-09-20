import IMyInfo from '@icalingua/types/http/IMyInfo';
import { ref } from 'vue';
import axiosClient from '../services/axiosClient';

export const myInfo = ref<IMyInfo>();

/** 刷新用户信息 */
export const refreshMyInfo = async () => {
  const { data } = await axiosClient.client.get<IMyInfo>('/myInfo');
  myInfo.value = data;
};
