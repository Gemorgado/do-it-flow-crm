
import type { ConexaSnapshot } from './conexa/types';

export interface PersistenceAdapter {
  upsertSnapshot: (snap: ConexaSnapshot) => Promise<void>;
  getLastSnapshot: () => Promise<ConexaSnapshot | null>;
}

class LocalStorageAdapter implements PersistenceAdapter {
  private KEY = 'conexa_snapshot';
  
  async upsertSnapshot(snap: ConexaSnapshot): Promise<void> {
    localStorage.setItem(this.KEY, JSON.stringify(snap));
  }
  
  async getLastSnapshot(): Promise<ConexaSnapshot | null> {
    const raw = localStorage.getItem(this.KEY);
    return raw ? (JSON.parse(raw) as ConexaSnapshot) : null;
  }
}

export const persistence: PersistenceAdapter = new LocalStorageAdapter();
