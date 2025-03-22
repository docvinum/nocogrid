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
import { db } from '../db';  // Importer db au niveau du module

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
        // Normalisation de l'URL
        let normalizedApiUrl = apiUrl;
        if (!normalizedApiUrl.endsWith('/')) {
          normalizedApiUrl += '/';
        }
        const endpoint = `${normalizedApiUrl}db/data/${tableId}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Mettre à jour les données de la grille
        rowData.value = response.data;

        // Enregistrer les données dans IndexedDB pour le mode offline
        await db.records.clear();
        const now = Date.now();
        const recordsToAdd = rowData.value.map((item: any) => ({ data: item, lastUpdated: now }));
        await db.records.bulkAdd(recordsToAdd);

        // Générer les colonnes dynamiquement
        if (rowData.value.length > 0) {
          const keys = Object.keys(rowData.value[0]);
          colDefs.value = keys.map((key) => ({ field: key, headerName: key.toUpperCase() }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données via API :', error);
        // En cas d'erreur (offline ou problème réseau), charger les données depuis IndexedDB
        const cachedRecords = await db.records.toArray();
        if (cachedRecords.length > 0) {
          // Ajout d'une annotation explicite pour "record"
          rowData.value = cachedRecords.map((record: { data: any }) => record.data);
          if (rowData.value.length > 0) {
            const keys = Object.keys(rowData.value[0]);
            colDefs.value = keys.map((key) => ({ field: key, headerName: key.toUpperCase() }));
          }
        } else {
          console.error("Aucune donnée en cache n'est disponible.");
        }
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
