<template>
  <div class="grid-container">
    <div class="selection">
      <div class="form-group">
        <label for="base">Sélectionnez une base</label>
        <select id="base" v-model="selectedBaseId" @change="fetchTables">
          <option disabled value="">Veuillez choisir une base</option>
          <option v-for="base in bases" :key="base.id" :value="base.id">
            {{ base.title }}
          </option>
        </select>
      </div>
      <div class="form-group" v-if="tables.length > 0">
        <label for="table">Sélectionnez une table</label>
        <select id="table" v-model="selectedTableId" @change="fetchData">
          <option disabled value="">Veuillez choisir une table</option>
          <option v-for="table in tables" :key="table.id" :value="table.id">
            {{ table.title }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid-area">
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: calc(100% - 100px);"
        :columnDefs="colDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :rowHeight="30"
        @grid-ready="onGridReady"
        @cellValueChanged="onCellValueChanged">
      </ag-grid-vue>
    </div>
    
    <!-- Indicateurs de chargement et messages d'erreur -->
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef } from 'ag-grid-community';
import axios from 'axios';

export default defineComponent({
  name: 'GridDynamic',
  components: { AgGridVue },
  setup() {
    // Récupération du domaine et du token depuis le localStorage
    const domain = localStorage.getItem('nocodbDomain') || '';
    const token = localStorage.getItem('nocodbToken') || '';

    // États réactifs
    const bases = ref<Array<{ id: string; title: string }>>([]);
    const tables = ref<Array<{ id: string; title: string }>>([]);
    const selectedBaseId = ref('');
    const selectedTableId = ref('');
    const rowData = ref<any[]>([]);
    const colDefs = ref<ColDef[]>([]);
    const loading = ref(false);
    const errorMessage = ref('');

    const defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
    };

    // Pour accéder à l'API de la grille
    const gridApi = ref<any>(null);
    const onGridReady = (params: any) => {
      gridApi.value = params.api;
      console.log('Grid ready. API:', gridApi.value);
      // Ajuster les colonnes si des données sont déjà chargées
      if (rowData.value.length > 0) {
        gridApi.value.sizeColumnsToFit();
      }
    };

    // Récupère la liste des bases depuis l'API NocoDB v2
    const fetchBases = async () => {
      if (!domain) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = `${normalizedDomain}/api/v2/meta/bases`;
      console.log('Fetching bases from:', url);
      try {
        loading.value = true;
        const response = await axios.get(url, {
          headers: { 'xc-token': token },
          params: { limit: 25, offset: 0 },
        });
        console.log('Bases response:', response.data);
        bases.value = response.data.list || [];
        loading.value = false;
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des bases.';
        console.error('Erreur:', error);
        loading.value = false;
      }
    };

    // Récupère la liste des tables pour la base sélectionnée
    const fetchTables = async () => {
      if (!selectedBaseId.value) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = `${normalizedDomain}/api/v2/meta/bases/${selectedBaseId.value}/tables`;
      console.log('Fetching tables from:', url);
      try {
        loading.value = true;
        const response = await axios.get(url, {
          headers: { 'xc-token': token },
        });
        console.log('Tables response:', response.data);
        tables.value = response.data.list || [];
        loading.value = false;
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des tables.';
        console.error('Erreur:', error);
        loading.value = false;
      }
    };

    // Récupère les enregistrements pour la table sélectionnée et génère dynamiquement les colonnes
    const fetchData = async () => {
      if (!selectedTableId.value) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = `${normalizedDomain}/api/v2/tables/${selectedTableId.value}/records`;
      console.log('Fetching data from:', url);
      try {
        loading.value = true;
        const response = await axios.get(url, {
          headers: { 'xc-token': token },
        });
        console.log('Data response:', response.data);
        // Utiliser la propriété "list" pour récupérer les enregistrements
        rowData.value = response.data.list ? response.data.list : response.data;
        // Génération dynamique des colonnes à partir du premier enregistrement
        if (rowData.value.length > 0) {
          const keys = Object.keys(rowData.value[0]);
          colDefs.value = keys.map(key => ({
            field: key,
            headerName: key.toUpperCase(),
            editable: true,
            sortable: true,
            filter: true,
            width: 150,
            valueFormatter: (params: any) => {
              if (params.value && typeof params.value === 'object') {
                return params.value.display_name ? params.value.display_name : JSON.stringify(params.value);
              }
              return params.value;
            }
          }));
          // Si la grille est déjà prête, ajuster la taille des colonnes
          if (gridApi.value) {
            gridApi.value.sizeColumnsToFit();
          }
        }
        loading.value = false;
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des données.';
        console.error('Erreur:', error);
        loading.value = false;
      }
    };

    const onCellValueChanged = (params: any) => {
      console.log('Valeur modifiée:', params.data);
    };

    // Au montage, récupérer la liste des bases
    onMounted(() => {
      fetchBases();
    });

    // Optionnel : surveiller selectedTableId et charger les données automatiquement si la valeur change
    // watch(selectedTableId, () => { if(selectedTableId.value) fetchData(); });

    return {
      bases,
      tables,
      selectedBaseId,
      selectedTableId,
      rowData,
      colDefs,
      defaultColDef,
      fetchBases,
      fetchTables,
      fetchData,
      onCellValueChanged,
      loading,
      errorMessage,
      onGridReady,
    };
  },
});
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

.selection {
  padding: 1rem;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.grid-area {
  flex-grow: 1;
  overflow: auto;
  background-color: #fff;
}

.loading,
.error {
  text-align: center;
  padding: 1rem;
  font-weight: bold;
}

.loading {
  color: #007BFF;
}

.error {
  color: red;
}
</style>
