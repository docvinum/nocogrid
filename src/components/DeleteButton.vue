<template>
  <button @click="handleDelete" class="delete-btn">Supprimer</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeleteButton',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleDelete() {
      // Vérifier que params.onDelete est une fonction, puis l'appeler avec params.data
      if (this.params && typeof this.params.onDelete === 'function') {
        this.params.onDelete(this.params.data);
      } else {
        console.error('onDelete is not defined in params');
      }
    },
  },
});
</script>

<style scoped>
.delete-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}
</style>
