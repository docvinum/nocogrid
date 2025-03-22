<template>
  <div class="config-container">
    <h1>Configuration de l'API Nocodb</h1>
    <!-- Formulaire de saisie de l'URL et du token -->
    <form @submit.prevent="submitConfig">
      <div>
        <label for="apiUrl">URL de l'API Nocodb (ex: https://lims.ovh/api/v2/)</label>
        <input id="apiUrl" v-model="apiUrl" type="text" required />
      </div>
      <div>
        <label for="token">Token d'accès Nocodb</label>
        <input id="token" v-model="token" type="text" required />
      </div>
      <button type="submit">Valider</button>
    </form>

    <!-- Dropdown pour sélectionner une base, affiché après récupération -->
    <div v-if="bases.length > 0">
      <h2>Sélectionnez une Base</h2>
      <select v-model="selectedBaseId" @change="fetchTables">
        <option disabled value="">Veuillez choisir une base</option>
        <option v-for="base in bases" :key="base.id" :value="base.id">
          {{ base.name }}
        </option>
      </select>
    </div>

    <!-- Dropdown pour sélectionner une table, affiché après sélection de la base -->
    <div v-if="tables.length > 0">
      <h2>Sélectionnez une Table</h2>
      <select v-model="selectedTableId">
        <option disabled value="">Veuillez choisir une table</option>
        <option v-for="table in tables" :key="table.id" :value="table.id">
          {{ table.name }}
        </option>
      </select>
    </div>

    <!-- Bouton de validation lorsque la table est sélectionnée -->
    <div v-if="selectedTableId">
      <button @click="saveConfigAndGoToGrid">Afficher la Table</button>
    </div>

    <!-- Zone d'affichage d'éventuelles erreurs -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface Base {
  id: string;
  name: string;
  // D'autres propriétés éventuelles peuvent être ajoutées
}

interface Table {
  id: string;
  name: string;
  // D'autres propriétés éventuelles peuvent être ajoutées
}

export default defineComponent({
  name: 'NocoConfiguration',
  setup() {
    const router = useRouter();
    const apiUrl = ref('');
    const token = ref('');
    const bases = ref<Base[]>([]);
    const tables = ref<Table[]>([]);
    const selectedBaseId = ref('');
    const selectedTableId = ref('');
    const errorMessage = ref('');

    // Fonction pour récupérer la liste des bases
    const submitConfig = async () => {
      bases.value = [];
      tables.value = [];
      errorMessage.value = '';
      try {
        const response = await axios.get(`${apiUrl.value}meta/bases`, {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        // Adaptez cette ligne en fonction de la structure de la réponse de votre API
        bases.value = response.data;
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des bases : ' + error;
      }
    };

    // Fonction pour récupérer la liste des tables de la base sélectionnée
    const fetchTables = async () => {
      tables.value = [];
      errorMessage.value = '';
      if (!selectedBaseId.value) return;
      try {
        const response = await axios.get(`${apiUrl.value}meta/bases/${selectedBaseId.value}/tables`, {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        // Adaptez cette ligne en fonction de la structure de la réponse de votre API
        tables.value = response.data;
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des tables : ' + error;
      }
    };

    // Sauvegarde de la configuration et redirection vers la page de la grille
    const saveConfigAndGoToGrid = () => {
      localStorage.setItem('nocodbApiUrl', apiUrl.value);
      localStorage.setItem('nocodbToken', token.value);
      localStorage.setItem('nocodbBaseId', selectedBaseId.value);
      localStorage.setItem('nocodbTableId', selectedTableId.value);
      router.push({ name: 'Grid' });
    };

    return {
      apiUrl,
      token,
      bases,
      tables,
      selectedBaseId,
      selectedTableId,
      submitConfig,
      fetchTables,
      saveConfigAndGoToGrid,
      errorMessage,
    };
  },
});
</script>

<style scoped>
.config-container {
  padding: 1rem;
}
label {
  display: block;
  margin-top: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>

