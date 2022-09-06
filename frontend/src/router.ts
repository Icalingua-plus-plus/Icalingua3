import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardWithThis,
} from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import clientSocket from './services/ClientSocket';

/** 设置页面 */
const ConfigPage = () => import('./pages/ConfigPage.vue');

/** 路由守卫，带有该守卫的页面需要登录 */
const needLogin: NavigationGuardWithThis<undefined> = (to) => {
  if (!clientSocket.socket) return { path: '/', query: { to: to.path } };
  return true;
};

const routes: RouteRecordRaw[] = [
  { path: '/', component: LoginPage },
  { path: '/config', component: ConfigPage, beforeEnter: needLogin },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
