// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker'

import {
    ModuleRegistry,
    AllCommunityModule,
} from 'ag-grid-community';

ModuleRegistry.registerModules([
    AllCommunityModule,
]);

createApp(App).mount('#app');

