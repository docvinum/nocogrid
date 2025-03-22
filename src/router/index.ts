// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import GridStatic from '../components/GridStatic.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'GridStatic', component: GridStatic },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
