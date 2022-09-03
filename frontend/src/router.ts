import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';

const routes: RouteRecordRaw[] = [{ path: '/', component: LoginPage }];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
