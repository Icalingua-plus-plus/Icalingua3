import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const LoginPage = () => import('./pages/LoginPage.vue');

const routes: RouteRecordRaw[] = [{ path: '/login', component: LoginPage }];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
