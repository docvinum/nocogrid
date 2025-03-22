import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import NocoConfiguration from '../components/NocoConfiguration.vue';
import GridDynamic from '../components/GridDynamic.vue'; // Mise à jour ici

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'NocoConfiguration', component: NocoConfiguration },
  { path: '/grid', name: 'GridDynamic', component: GridDynamic },  // Vous pouvez garder la route nommée "Grid" ou la renommer
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
