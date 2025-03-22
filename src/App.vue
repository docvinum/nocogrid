<template>
  <div class="config-container">
    <h1>Configuration de NocoDB</h1>
    <form @submit.prevent="submitConfig">
      <div class="form-group">
        <label for="apiUrl">NocoDB API URL</label>
        <input
          type="text"
          id="apiUrl"
          v-model="apiUrl"
          placeholder="https://example.com/api/v2/"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NocoConfiguration',
  setup() {
    const apiUrl = ref('');
    const token = ref('');
    const router = useRouter();

    const submitConfig = () => {
      // Enregistrer dans le localStorage
      localStorage.setItem('nocodbApiUrl', apiUrl.value);
      localStorage.setItem('nocodbToken', token.value);
      // Rediriger vers la page Grid (assurez-vous que la route Grid est définie)
      router.push({ name: 'Grid' });
    };

    return { apiUrl, token, submitConfig };
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
</style>
