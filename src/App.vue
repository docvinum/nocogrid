<template>
  <div class="container">
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 100%;"
      :columnDefs="colDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef">
    </ag-grid-vue>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef } from 'ag-grid-community';

export default defineComponent({
  name: 'App',
  components: { AgGridVue },
  setup() {
    // Définir les colonnes de la grille (placeholder)
    const colDefs = ref<ColDef[]>([
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
    ]);

    // Utiliser des données statiques pour tester la datatable
    const rowData = ref<any[]>([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      { id: 4, name: 'Diana', email: 'diana@example.com' },
    ]);

    // Configuration par défaut des colonnes
    const defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    };

    return { colDefs, rowData, defaultColDef };
  },
});
</script>

<style>
/* Assurez-vous que l'application occupe toute la hauteur de l'écran */
html, body, #app {
  height: 100%;
  margin: 0;
}
.container {
  height: 100%;
}
/* Importer les styles d'AG Grid et le thème Alpine */
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
</style>

