// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker'
// Importer le module nécessaire pour le row model client-side
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';

// Enregistrer le module ClientSideRowModelModule
ModuleRegistry.registerModules([ClientSideRowModelModule]);

createApp(App).mount('#app');

