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
/** 聊天室列表页面 */
const ChatRoomsPage = () => import('./pages/ChatRoomsPage.vue');
/** 聊天页面 */
const ChatPage = () => import('./pages/ChatPage.vue');
/** 合并转发消息页面 */
const ForwardMsgPage = () => import('./pages/ForwardMsgPage.vue');
/** WebAuthn 密钥管理页面 */
const WebAuthnPage = () => import('./pages/WebAuthnPage.vue');

/** 路由守卫，带有该守卫的页面需要登录 */
const needLogin: NavigationGuardWithThis<undefined> = (to) => {
  if (!axiosClient.loggedIn) return { path: '/login', query: { to: to.path } };
  return true;
};

const routes: RouteRecordRaw[] = [
  { path: '/login', component: LoginPage },
  {
    path: '/',
    component: ChatRoomsPage,
    beforeEnter: needLogin,
    children: [
      { path: 'chat/:roomId', component: ChatPage, beforeEnter: needLogin },
      { path: 'fwd/:resId', component: ForwardMsgPage, beforeEnter: needLogin },
    ],
  },
  { path: '/config', component: ConfigPage, beforeEnter: needLogin },
  { path: '/webAuthn', component: WebAuthnPage, beforeEnter: needLogin },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
