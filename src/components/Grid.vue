<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef } from 'ag-grid-community';
import axios from 'axios';
import { db } from '../db';  // Importer notre base de données locale

// Importation du type SyncOperation pour bénéficier du typage
import type { SyncOperation } from '../db';

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
      editable: true,
    };

    // Fonction de récupération des données depuis l'API Nocodb v2
    const fetchData = async () => {
      try {
        let normalizedApiUrl = apiUrl;
        if (!normalizedApiUrl.endsWith('/')) {
          normalizedApiUrl += '/';
        }
        const endpoint = `${normalizedApiUrl}db/data/${tableId}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        rowData.value = response.data;

        // Enregistrer les données dans IndexedDB pour le mode offline
        await db.records.clear();
        const now = Date.now();
        const recordsToAdd = rowData.value.map((item: any) => ({ data: item, lastUpdated: now }));
        await db.records.bulkAdd(recordsToAdd);

        if (rowData.value.length > 0) {
          const keys = Object.keys(rowData.value[0]);
          colDefs.value = keys.map((key) => ({ field: key, headerName: key.toUpperCase() }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération via API :', error);
        const cachedRecords = await db.records.toArray();
        if (cachedRecords.length > 0) {
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

    // Gestion des modifications inline
    const onCellValueChanged = async (params: any) => {
      const updatedRecord = params.data;
      try {
        let normalizedApiUrl = apiUrl;
        if (!normalizedApiUrl.endsWith('/')) {
          normalizedApiUrl += '/';
        }
        const endpoint = `${normalizedApiUrl}db/data/${tableId}/${updatedRecord.id}`;
        await axios.put(endpoint, updatedRecord, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Mise à jour réussie via API.');
      } catch (error) {
        console.error('Erreur lors de la mise à jour via API :', error);
        // Déclaration explicite de l'opération avec le type SyncOperation
        const operation: SyncOperation = {
          operation: 'update',
          recordId: updatedRecord.id,
          data: updatedRecord,
          timestamp: Date.now(),
        };
        await db.syncQueue.add(operation);
        console.log('Opération enregistrée dans la file d\'attente de synchronisation.');
      }
    };

    // Fonction de synchronisation pour traiter les opérations en attente
    const syncOperations = async () => {
      const pendingOps = await db.syncQueue.toArray();
      for (const op of pendingOps) {
        try {
          let normalizedApiUrl = apiUrl;
          if (!normalizedApiUrl.endsWith('/')) {
            normalizedApiUrl += '/';
          }
          const endpoint = `${normalizedApiUrl}db/data/${tableId}/${op.recordId}`;
          if (op.operation === 'update') {
            await axios.put(endpoint, op.data, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
          // En cas de succès, supprimer l'opération de la file d'attente
          if (op.id !== undefined) {
            await db.syncQueue.delete(op.id);
            console.log(`Opération ${op.id} synchronisée et supprimée de la file.`);
          }
        } catch (error) {
          console.error('Erreur de synchronisation pour l\'opération', op, error);
        }
      }
    };

    onMounted(() => {
      fetchData();
    });

    return { colDefs, rowData, defaultColDef, onCellValueChanged, syncOperations };
  },
});
</script>
