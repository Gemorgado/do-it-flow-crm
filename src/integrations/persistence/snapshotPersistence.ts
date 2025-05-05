
import type { ConexaSnapshot } from "../conexa/types";
import { store, saveToStorage } from "./store";

export const snapshotPersistence = {
  getSnapshot: async (): Promise<any> => {
    // Legacy method - returns raw snapshot data
    return Promise.resolve(store.snapshots[0] || null);
  },

  saveSnapshot: async (data: any): Promise<void> => {
    // Legacy method - saves raw snapshot data
    store.snapshots = [data];
    saveToStorage();
    return Promise.resolve();
  },

  clearSnapshot: async (): Promise<void> => {
    // Legacy method - clears all snapshots
    store.snapshots = [];
    saveToStorage();
    return Promise.resolve();
  },
  
  upsertSnapshot: async (snapshot: ConexaSnapshot): Promise<void> => {
    // Adiciona ou atualiza o snapshot
    const syncDate = snapshot.syncedAt;
    const existingIndex = store.snapshots.findIndex(snap => snap.syncedAt === syncDate);
    
    if (existingIndex !== -1) {
      store.snapshots[existingIndex] = snapshot;
    } else {
      store.snapshots.push(snapshot);
    }
    
    // Manter apenas o snapshot mais recente, limitando o armazenamento
    if (store.snapshots.length > 5) {
      store.snapshots.sort((a, b) => 
        new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
      );
      store.snapshots = store.snapshots.slice(0, 5);
    }
    
    saveToStorage();
    return Promise.resolve();
  },
  
  getLastSnapshot: async (): Promise<ConexaSnapshot | null> => {
    if (store.snapshots.length === 0) {
      return Promise.resolve(null);
    }
    
    // Ordenar snapshots por data e retornar o mais recente
    const sortedSnapshots = [...store.snapshots].sort(
      (a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
    );
    
    return Promise.resolve(sortedSnapshots[0]);
  }
};
