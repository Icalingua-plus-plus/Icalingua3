import axios, { AxiosRequestConfig } from 'axios';

/** axios 实例，内含验证 */
class AxiosClient {
  client = axios.create({ baseURL: '/api' });

  /** 正确的实例已被生成 */
  loggedIn = false;

  /** 改变 axios 配置 */
  changeConfig(config?: AxiosRequestConfig<any>) {
    this.client = axios.create({ ...config, baseURL: '/api' });
  }

  /** 改变 Token */
  changeToken(token: string) {
    this.changeConfig({ headers: { Authorization: `Bearer ${token}` } });
    this.loggedIn = true;
  }

  /** 登录
   * @param password 密码
   * @returns 登录后得到的 token
   */
  async login(password: string) {
    const res = await this.client.post<string>('/login', { password });
    this.changeToken(res.data);
    return res.data;
  }
}

const axiosClient = new AxiosClient();

export default axiosClient;
