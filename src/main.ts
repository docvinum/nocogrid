import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// import 'ag-grid-enterprise'; // importe l'édition Enterprise
// import { LicenseManager } from 'ag-grid-enterprise';

// Optionnel : vous pouvez combiner AllCommunityModules avec Enterprise
ModuleRegistry.registerModules([AllCommunityModule]);

// Licence Enterprise
// LicenseManager.setLicenseKey("Votre clé de licence ici");

createApp(App).use(router).mount('#app');