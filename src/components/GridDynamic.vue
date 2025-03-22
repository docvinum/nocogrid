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
            {{ table.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="grid-area" v-if="rowData.length > 0">
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: calc(100% - 100px);"
        :columnDefs="colDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        @cellValueChanged="onCellValueChanged">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import type { ColDef } from 'ag-grid-community';

export default defineComponent({
  name: 'GridDynamic',
  components: { AgGridVue },
  setup() {
    // Récupérer domaine et token depuis le localStorage
    const domain = localStorage.getItem('nocodbDomain') || '';
    const token = localStorage.getItem('nocodbToken') || '';

    const bases = ref<Array<{ id: string; title: string }>>([]);
    const tables = ref<Array<{ id: string; name: string }>>([]);
    const selectedBaseId = ref('');
    const selectedTableId = ref('');
    const rowData = ref<any[]>([]);
    const colDefs = ref<ColDef[]>([]);
    const defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
    };

    const fetchBases = async () => {
      if (!domain) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = normalizedDomain + '/api/v2/meta/bases';
      console.log('Fetching bases from:', url);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Bases response:', response.data);
        bases.value = response.data.list || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des bases:', error);
      }
    };

    const fetchTables = async () => {
      if (!selectedBaseId.value) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = `${normalizedDomain}/api/v2/meta/bases/${selectedBaseId.value}/tables`;
      console.log('Fetching tables from:', url);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Tables response:', response.data);
        tables.value = response.data.list || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des tables:', error);
      }
    };

    const fetchData = async () => {
      if (!selectedTableId.value) return;
      const normalizedDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
      const url = `${normalizedDomain}/api/v2/db/data/${selectedTableId.value}`;
      console.log('Fetching data from:', url);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Data response:', response.data);
        rowData.value = response.data;
        if (rowData.value.length > 0) {
          const keys = Object.keys(rowData.value[0]);
          colDefs.value = keys.map(key => ({ field: key, headerName: key.toUpperCase() }));
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

    return { bases, tables, selectedBaseId, selectedTableId, rowData, colDefs, defaultColDef, fetchBases, fetchTables, fetchData, onCellValueChanged };
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
.selection {
  padding: 1rem;
  background-color: #f9f9f9;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
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
}
</style>
