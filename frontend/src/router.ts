import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';

/** 设置页面 */
const ConfigPage = () => import('./pages/ConfigPage.vue');

const routes: RouteRecordRaw[] = [
  { path: '/', component: LoginPage },
  { path: '/config', component: ConfigPage },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
