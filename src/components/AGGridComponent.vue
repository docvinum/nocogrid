<template>
  <!-- Dimensions fixes pour illustrer, ajustez selon votre mise en page -->
  <div style="height: 600px; width: 100%;">
    <!-- 
      On reste en mode legacy : on applique la classe "ag-theme-alpine" 
      et on précise theme="legacy" pour éviter tout conflit en v33
    -->
    <ag-grid-vue3
      class="ag-theme-alpine"
      theme="legacy"
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
import { AgGridVue } from 'ag-grid-vue3';
import {
  ModuleRegistry,
  // Modules obligatoires
  ClientSideRowModelModule,
  // Pagination
  PaginationModule,
  // Éventuels modules de filtres ou d’édition
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  TextEditorModule,
  ValidationModule,
} from 'ag-grid-community';

// On enregistre tous les modules nécessaires :
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  TextEditorModule,
  ValidationModule
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
      modules: [
        ClientSideRowModelModule,
        PaginationModule,
        TextFilterModule,
        NumberFilterModule,
        DateFilterModule,
        TextEditorModule,
        ValidationModule
      ],
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true },
        { headerName: 'Nom', field: 'name', sortable: true, filter: true, editable: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, editable: true },
      ],
      rowData: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
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
/* Importation du système de styles legacy : */
@import "ag-grid-community/dist/styles/ag-grid.css";
@import "ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>

