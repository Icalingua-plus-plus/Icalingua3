import {
  createRouter,
  createWebHistory,
  NavigationGuardWithThis,
  RouteRecordRaw,
} from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import axiosClient from './services/axiosClient';

/** 设置页面 */
const ConfigPage = () => import('./pages/ConfigPage.vue');
/** 聊天室页面 */
const ChatRoomsPage = () => import('./pages/ChatRoomsPage.vue');

/** 路由守卫，带有该守卫的页面需要登录 */
const needLogin: NavigationGuardWithThis<undefined> = (to) => {
  if (!axiosClient.loggedIn) return { path: '/', query: { to: to.path } };
  return true;
};

const routes: RouteRecordRaw[] = [
  { path: '/', component: LoginPage },
  { path: '/chatRooms', component: ChatRoomsPage, beforeEnter: needLogin },
  { path: '/config', component: ConfigPage, beforeEnter: needLogin },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
