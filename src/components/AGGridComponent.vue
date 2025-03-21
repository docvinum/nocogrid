<template>
  <!-- Le style inline "height: 600px; width: 100%;" est un exemple de dimensions pour la grille -->
  <div style="height: 600px; width: 100%;">
    <!-- 
      Nous utilisons le nouveau Theming API avec "theme='alpine'".
      Plus besoin de classe "ag-theme-alpine" ni d'import "ag-grid.css".
    -->
    <ag-grid-vue3
      theme="alpine"         <!-- Nouveau Theming API -->
      :modules="modules"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :animateRows="true"
      :pagination="true"
      :paginationPageSize="50"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue3>
  </div>
</template>

<script>
/**
 * 1. Importation du composant AgGridVue depuis 'ag-grid-vue3'
 * 2. Importation des modules nécessaires d'AG Grid Community
 */
import { AgGridVue } from 'ag-grid-vue3';
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  TextEditorModule,
} from 'ag-grid-community';

/**
 * 3. Enregistrement des modules
 *    Nous déclarons ici toutes les fonctionnalités dont nous avons besoin :
 *    - Modèle de lignes côté client
 *    - Pagination
 *    - Filtres (texte, nombre, date)
 *    - Édition inline (texte)
 *    - Validation (optionnel pour voir les messages complets)
 */
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  TextEditorModule,
]);

export default {
  name: 'AGGridComponent',
  components: {
    'ag-grid-vue3': AgGridVue,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      // Vous pouvez également passer ces modules explicitement à la grille, mais l'enregistrement global suffit
      modules: [
        ClientSideRowModelModule,
        ValidationModule,
        PaginationModule,
        TextFilterModule,
        NumberFilterModule,
        DateFilterModule,
        TextEditorModule,
      ],
      // Définition des colonnes
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
          sortable: true,
          filter: true, // Active le filtre sur cette colonne => nécessite un FilterModule (TextFilter ou NumberFilter)
          editable: false, 
        },
        {
          headerName: 'Nom',
          field: 'name',
          sortable: true,
          filter: true,
          editable: true, // Édition inline => nécessite TextEditorModule
        },
        {
          headerName: 'Email',
          field: 'email',
          sortable: true,
          filter: true,
          editable: true,
        },
      ],
      // Données de test
      rowData: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
      // Configuration par défaut pour les colonnes
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true,
      },
    };
  },
  methods: {
    /**
     * 4. Récupération de l'API de la grille lors de l'événement grid-ready
     */
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  },
};
</script>

<style>
/* 5. Import du nouveau fichier de thème "theme-alpine.css" (Theming API de la v33 Community) */
@import "ag-grid-community/styles/theme-alpine.css";

/* Aucun import de "ag-grid.css" ou d'anciennes feuilles de style */
</style>

