<template>
  <!-- Le style inline "height: 600px; width: 100%;" est un exemple, adaptez selon votre mise en page -->
  <div style="height: 600px; width: 100%;">
    <ag-grid-vue3
      theme="alpine"              <!-- IMPORTANT : indique qu'on utilise le nouveau thème Alpine -->
      :modules="modules"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :animateRows="true"
      :pagination="true"
      :paginationPageSize="50"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
/**
 * IMPORTS
 * - Le composant AgGridVue depuis 'ag-grid-vue3'
 * - Les modules d'AG Grid Community depuis 'ag-grid-community'
 */
import { AgGridVue } from 'ag-grid-vue3';
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  TextEditorModule,
} from 'ag-grid-community';

/**
 * ENREGISTREMENT DES MODULES
 * On indique à AG Grid les fonctionnalités que nous allons utiliser.
 */
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  TextEditorModule,
]);

export default {
  name: 'AGGridComponent',
  components: {
    'ag-grid-vue3': AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      // Liste des modules à passer explicitement à la grille si souhaité
      modules: [
        ClientSideRowModelModule,
        ValidationModule,
        PaginationModule,
        TextFilterModule,
        NumberFilterModule,
        DateFilterModule,
        TextEditorModule,
      ],
      // Définitions de colonnes
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
          sortable: true,
          filter: true,  // active un filtre (texte par défaut) => nécessite TextFilterModule (ou NumberFilter si c'est un ID numérique)
        },
        {
          headerName: 'Nom',
          field: 'name',
          sortable: true,
          filter: true,
          editable: true, // permet l'édition inline => nécessite TextEditorModule
        },
        {
          headerName: 'Email',
          field: 'email',
          sortable: true,
          filter: true,
          editable: true,
        },
      ],
      // Données de base pour illustration
      rowData: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
      // Configuration par défaut de chaque colonne
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true,
      },
    };
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  },
};
</script>

<style>
/* Import du thème Alpine (nouveau Theming API) */
@import "ag-grid-community/styles/theme-alpine.css";

/* Ici, vous n'importez PAS 'ag-grid.css' ni 'ag-theme-alpine.css' (legacy) */
</style>

