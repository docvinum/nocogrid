import Dexie from 'dexie';

// Définition de l'interface pour un enregistrement
export interface RecordData {
  id?: number; // clé auto-incrémentée
  data: any;   // Vous pouvez adapter en fonction du schéma
  lastUpdated: number;
}

export interface SyncOperation {
  id?: number;
  operation: 'insert' | 'update' | 'delete';
  recordId: number;
  data: any;
  timestamp: number;
}

// Création de la base de données Dexie
export class NocoGridDB extends Dexie {
  public records: Dexie.Table<RecordData, number>;
  public syncQueue: Dexie.Table<SyncOperation, number>;

  public constructor() {
    super('NocoGridDB');
    this.version(1).stores({
      // La table "records" stocke les enregistrements de la grille
      records: '++id, lastUpdated',
      // La table "syncQueue" stocke les opérations à synchroniser
      syncQueue: '++id, operation, recordId, timestamp'
    });
    this.records = this.table('records');
    this.syncQueue = this.table('syncQueue');
  }
}

export const db = new NocoGridDB();

