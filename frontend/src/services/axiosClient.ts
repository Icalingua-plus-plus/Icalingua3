import axios, { AxiosRequestConfig } from 'axios';

/** axios 实例，内含验证 */
class AxiosClient {
  client = axios.create();

  /** 改变 axios 配置 */
  changeConfig(config?: AxiosRequestConfig<any>) {
    this.client = axios.create(config);
  }

  /** 改变 Token */
  changeToken(token: string) {
    this.changeConfig({ headers: { Authorization: `Bearer ${token}` } });
  }
}

const axiosClient = new AxiosClient();

export default axiosClient;
