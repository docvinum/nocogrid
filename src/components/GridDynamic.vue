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
    
    <!-- Message de chargement ou d'erreur -->
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
    // Récupérer domaine et token depuis le localStorage
    const domain = localStorage.getItem('nocodbDomain') || '';
    const token = localStorage.getItem('nocodbToken') || '';

    // États
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

    // Déclarez gridApi pour stocker l'instance de la grille
    const gridApi = ref<any>(null);
    // Fonction déclenchée lorsque la grille est prête
    const onGridReady = (params: any) => {
      // Affectation de l'API
      gridApi.value = params.api;

      // Log détaillé pour vérifier ce qu'on a
      console.log('gridApi.value:', gridApi.value);
      
      // Ajustement éventuel des colonnes
      params.api.sizeColumnsToFit();
    };

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

    const fetchData = async () => {
      if (!selectedTableId.value) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = `${normalizedDomain}/api/v2/tables/${selectedTableId.value}/records`;
      console.log('Fetching data from:', url);
      try {
        const response = await axios.get(url, {
          headers: { 'xc-token': token },
        });
        console.log('Data response:', response.data);
        rowData.value = response.data.list ? response.data.list : response.data;
        console.log('rowData after fetchData:', JSON.parse(JSON.stringify(rowData.value)));
        
        if (rowData.value.length > 0) {
          const keys = Object.keys(rowData.value[0]);
          colDefs.value = keys.map(key => ({
            field: key,
            headerName: key.toUpperCase(),
            editable: true,
            sortable: true,
            filter: true,
            valueFormatter: (params: any) => {
              if (params.value && typeof params.value === 'object') {
                return params.value.display_name ? params.value.display_name : JSON.stringify(params.value);
              }
              return params.value;
            }
          }));
          console.log('colDefs after generation:', JSON.parse(JSON.stringify(colDefs.value)));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };


    const onCellValueChanged = (params: any) => {
      console.log('Valeur modifiée:', params.data);
    };

    onMounted(() => {
      fetchBases();
    });

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
      onGridReady  // Ajoutez ici pour l'utiliser dans le template
    };
  },
});
</script>

<style scoped>
/* Conteneur principal : occupe toute la hauteur de la fenêtre */
.grid-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

/* Section de sélection (dropdowns) : zone de configuration */
.selection {
  padding: 1rem;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Groupes de formulaire */
.form-group {
  margin-bottom: 1rem;
}

/* Étiquette de formulaire */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

/* Style des dropdowns */
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Zone de la grille : occupe tout l'espace restant */
.grid-area {
  flex-grow: 1;
  overflow: auto;
  background-color: #fff;
}

/* Messages de chargement et d'erreur */
.loading, .error {
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
