<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
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

    const bases = ref<Array<{ id: string; title: string }>>([]);
    const tables = ref<Array<{ id: string; title: string }>>([]);
    const selectedBaseId = ref(localStorage.getItem('nocodbSelectedBaseId') || '');
    const selectedTableId = ref(localStorage.getItem('nocodbSelectedTableId') || '');
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

    const gridApi = ref<any>(null);

    // Fonction de sauvegarde de l'état de la grille
    const saveGridState = () => {
      if (!gridApi.value) return;
      const columnState = gridApi.value.getColumnState();
      const sortModel = gridApi.value.getSortModel();
      const filterModel = gridApi.value.getFilterModel();
      const gridState = { columnState, sortModel, filterModel };
      localStorage.setItem('gridState', JSON.stringify(gridState));
      console.log('Grid state saved:', gridState);
    };

    // Fonction de restauration de l'état de la grille
    const restoreGridState = () => {
      const savedState = localStorage.getItem('gridState');
      if (savedState && gridApi.value) {
        const { columnState, sortModel, filterModel } = JSON.parse(savedState);
        gridApi.value.setColumnState(columnState);
        gridApi.value.setSortModel(sortModel);
        gridApi.value.setFilterModel(filterModel);
        console.log('Grid state restored');
      }
    };

    const onGridReady = (params: any) => {
      gridApi.value = params.api;
      console.log('Grid ready. API:', gridApi.value);
      // Restaurer l'état de la grille s'il existe
      restoreGridState();
      params.api.sizeColumnsToFit();

      // Sauvegarder l'état dès que les colonnes sont déplacées ou redimensionnées, ou lorsque le tri/filtres changent
      params.api.addEventListener('columnMoved', saveGridState);
      params.api.addEventListener('columnResized', saveGridState);
      params.api.addEventListener('sortChanged', saveGridState);
      params.api.addEventListener('filterChanged', saveGridState);
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
        loading.value = true;
        const response = await axios.get(url, {
          headers: { 'xc-token': token },
        });
        console.log('Data response:', response.data);
        rowData.value = response.data.list ? response.data.list : response.data;
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

    // Conserver les sélections dans le localStorage
    watch(selectedBaseId, (newVal) => {
      localStorage.setItem('nocodbSelectedBaseId', newVal);
    });
    watch(selectedTableId, (newVal) => {
      localStorage.setItem('nocodbSelectedTableId', newVal);
    });

    onMounted(() => {
      fetchBases();
      if (selectedBaseId.value) {
        fetchTables();
      }
      if (selectedTableId.value) {
        fetchData();
      }
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 0;
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
