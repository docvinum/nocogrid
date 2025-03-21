<template>
  <div style="height: 600px; width: 100%;">
    <ag-grid-vue3
      theme="alpine"  <!-- utilisation du nouveau système de thème -->
      :modules="modules"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :animateRows="true"
      :pagination="true"
      :paginationPageSize="50"
      @grid-ready="onGridReady"
    ></ag-grid-vue3>
  </div>
</template>

<script>
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

// On enregistre tous les modules nécessaires
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
      modules: [
        ClientSideRowModelModule,
        ValidationModule,
        PaginationModule,
        TextFilterModule,
        NumberFilterModule,
        DateFilterModule,
        TextEditorModule,
      ],
      columnDefs: [
        {
          headerName: "ID",
          field: "id",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Nom",
          field: "name",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Email",
          field: "email",
          sortable: true,
          filter: true,
          editable: true,
        },
      ],
      rowData: [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" },
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
/* Import du thème Alpine nouvelle génération */
@import "ag-grid-community/styles/theme-alpine.css";
</style>

