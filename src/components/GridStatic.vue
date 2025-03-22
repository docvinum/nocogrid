<template>
  <div class="grid-container">
    <div class="actions">
      <button @click="addRecord">Ajouter un enregistrement</button>
      <button @click="syncOperations">Synchroniser</button>
    </div>
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: calc(100% - 60px);"
      :columnDefs="colDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      @cellValueChanged="onCellValueChanged">
    </ag-grid-vue>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef } from 'ag-grid-community';
import DeleteButton from './DeleteButton.vue';

export default defineComponent({
  name: 'GridStatic',
  components: { AgGridVue },
  setup() {
    // Données statiques de test
    const rowData = ref([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      { id: 4, name: 'Diana', email: 'diana@example.com' }
    ]);

    // Définir la fonction deleteRecord avant son utilisation
    const deleteRecord = (record: any) => {
      rowData.value = rowData.value.filter(r => r.id !== record.id);
      console.log('Enregistrement supprimé :', record);
    };

    // Colonnes statiques, avec une colonne "Actions" utilisant DeleteButton
    const colDefs = ref<ColDef[]>([
      { field: 'id', headerName: 'ID', editable: false },
      { field: 'name', headerName: 'Name', editable: true },
      { field: 'email', headerName: 'Email', editable: true },
      {
        headerName: 'Actions',
        cellRenderer: DeleteButton, // Utilisation de cellRendererFramework pour Vue
        cellRendererParams: { onDelete: deleteRecord },
        editable: false,
        sortable: false,
        filter: false,
      }
    ]);

    const defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    };

    const onCellValueChanged = (params: any) => {
      console.log('Valeur modifiée :', params.data);
    };

    // Fonction pour ajouter un enregistrement
    const addRecord = () => {
      const newId = rowData.value.length > 0 ? Math.max(...rowData.value.map(r => r.id)) + 1 : 1;
      const newRecord = { id: newId, name: 'New User', email: 'new@example.com' };
      rowData.value.push(newRecord);
      console.log('Nouvel enregistrement ajouté :', newRecord);
    };

    // Fonction de synchronisation simulée
    const syncOperations = () => {
      console.log('Synchronisation simulée.');
    };

    onMounted(() => {
      console.log('GridStatic monté avec données statiques');
    });

    return { rowData, colDefs, defaultColDef, onCellValueChanged, addRecord, deleteRecord, syncOperations };
  },
});
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.actions {
  display: flex;
  padding: 0.5rem;
  gap: 1rem;
  background-color: #f2f2f2;
  height: 60px;
  align-items: center;
}
.ag-grid-vue {
  flex-grow: 1;
}
button {
  padding: 0.5rem 1rem;
}
</style>
