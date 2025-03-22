<template>
  <div class="grid-container">
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 100%;"
      :columnDefs="colDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :animateRows="true">
    </ag-grid-vue>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef } from 'ag-grid-community';
import axios from 'axios';

export default defineComponent({
  name: 'Grid',
  components: { AgGridVue },
  setup() {
    // Récupération des informations de configuration depuis le localStorage
    const apiUrl = localStorage.getItem('nocodbApiUrl') || '';
    const token = localStorage.getItem('nocodbToken') || '';
    const baseId = localStorage.getItem('nocodbBaseId') || '';
    const tableId = localStorage.getItem('nocodbTableId') || '';

    // Définitions des colonnes et données
    const colDefs = ref<ColDef[]>([]);
    const rowData = ref<any[]>([]);
    const defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    };

    // Fonction de récupération des données depuis l'API Nocodb v2
    const fetchData = async () => {
      try {
        // Normalisation de l'URL pour s'assurer qu'elle se termine par '/'
        let normalizedApiUrl = apiUrl;
        if (!normalizedApiUrl.endsWith('/')) {
          normalizedApiUrl += '/';
        }
        // Construction de l'endpoint pour récupérer les données
        // Pour Nocodb v2, l'endpoint typique est : {apiUrl}/db/data/{tableId}
        const endpoint = `${normalizedApiUrl}db/data/${tableId}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Supposons que response.data contienne un tableau de lignes
        rowData.value = response.data;
        // Génération dynamique des colonnes à partir des clés du premier enregistrement (si disponible)
        if (rowData.value.length > 0) {
          const keys = Object.keys(rowData.value[0]);
          colDefs.value = keys.map((key) => ({ field: key, headerName: key.toUpperCase() }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return { colDefs, rowData, defaultColDef };
  },
});
</script>

<style scoped>
.grid-container {
  width: 100%;
  height: 100%;
}
</style>

