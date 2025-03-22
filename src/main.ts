import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

createApp(App).use(router).mount('#app');
