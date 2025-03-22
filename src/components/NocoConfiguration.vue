<template>
  <div class="config-container">
    <h1>Configuration de NocoDB</h1>
    <form @submit.prevent="testAndSaveConfig">
      <div class="form-group">
        <label for="domain">Domaine de l'API NocoDB</label>
        <input
          type="text"
          id="domain"
          v-model="domain"
          placeholder="https://example.com"
          required
        />
      </div>
      <div class="form-group">
        <label for="token">NocoDB API Token</label>
        <input
          type="text"
          id="token"
          v-model="token"
          placeholder="Votre token ici"
          required
        />
      </div>
      <button type="submit">Enregistrer et continuer</button>
    </form>
    <div v-if="connectionMessage" class="message" :class="{'success': connectionSuccess, 'error': !connectionSuccess}">
      {{ connectionMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NocoConfiguration',
  setup() {
    const domain = ref('');
    const token = ref('');
    const connectionMessage = ref('');
    const connectionSuccess = ref(false);
    const router = useRouter();

    const testAndSaveConfig = async () => {
      // Normaliser le domaine (supprimer le slash final s'il existe)
      const normalizedDomain = domain.value.endsWith('/')
        ? domain.value.slice(0, -1)
        : domain.value;
      // Construire l'URL de test
      const testUrl = `${normalizedDomain}/api/v2/meta/bases`;
      console.log('Test connection URL:', testUrl);
      try {
        const response = await axios.get(testUrl, {
          headers: { 'xc-token': token.value },
        });
        console.log('Réponse de test:', response.data);
        // Extraire la liste des bases depuis response.data.list
        if (response.data && response.data.list) {
          connectionMessage.value = 'Connexion réussie à l\'API NocoDB.';
          connectionSuccess.value = true;
          // Enregistrer les informations dans le localStorage
          localStorage.setItem('nocodbDomain', normalizedDomain);
          localStorage.setItem('nocodbToken', token.value);
          console.log('Configuration enregistrée.');
          // Afficher le message et rediriger après un court délai
          setTimeout(() => {
            router.push({ name: 'GridDynamic' });
          }, 1000);
        } else {
          connectionMessage.value = 'Réponse inattendue de l\'API.';
          connectionSuccess.value = false;
        }
      } catch (error) {
        console.error('Erreur lors de la connexion à l\'API:', error);
        connectionMessage.value = 'Erreur de connexion à l\'API NocoDB. Veuillez vérifier vos informations.';
        connectionSuccess.value = false;
      }
    };

    return { domain, token, testAndSaveConfig, connectionMessage, connectionSuccess };
  },
});
</script>

<style scoped>
.config-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.message {
  margin-top: 1rem;
  font-weight: bold;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
