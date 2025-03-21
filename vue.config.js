const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  // Aucune configuration supplémentaire pour isCustomElement,
  // ni pour la legacy, car on utilise le nouveau thème alpine.
});

