import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import NocoConfiguration from '../components/NocoConfiguration.vue';
import GridStatic from '../components/GridStatic.vue'; // Votre composant de grille (ou Grid.vue)

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'NocoConfiguration', component: NocoConfiguration },
  { path: '/grid', name: 'Grid', component: GridStatic },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
