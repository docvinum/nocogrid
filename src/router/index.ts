import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Configuration from '../components/Configuration.vue';
import Grid from '../components/Grid.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Configuration', component: Configuration },
  { path: '/grid', name: 'Grid', component: Grid },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

