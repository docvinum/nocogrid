<template>
  <div id="app">
    <h1>NocoGrid</h1>
    <AGGridComponent />
  </div>
</template>

<script>
import AGGridComponent from './components/AGGridComponent.vue';

export default {
  name: 'App',
  components: {
    AGGridComponent,
  },
};
</script>

