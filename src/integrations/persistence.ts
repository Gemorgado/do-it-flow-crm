
import type { ConexaSnapshot } from './conexa/types';
import type { SpaceBinding } from '@/types';

export interface PersistenceAdapter {
  upsertSnapshot: (snap: ConexaSnapshot) => Promise<void>;
  getLastSnapshot: () => Promise<ConexaSnapshot | null>;
  
  // Space binding methods
  listBindings: () => Promise<SpaceBinding[]>;
  bindSpace: (binding: SpaceBinding) => Promise<void>;
  unbindSpace: (spaceId: string) => Promise<void>;
}

class LocalStorageAdapter implements PersistenceAdapter {
  private KEY = 'conexa_snapshot';
  private BINDINGS_KEY = 'space_bindings';
  
  async upsertSnapshot(snap: ConexaSnapshot): Promise<void> {
    localStorage.setItem(this.KEY, JSON.stringify(snap));
  }
  
  async getLastSnapshot(): Promise<ConexaSnapshot | null> {
    const raw = localStorage.getItem(this.KEY);
    return raw ? (JSON.parse(raw) as ConexaSnapshot) : null;
  }
  
  // Space binding implementation
  async listBindings(): Promise<SpaceBinding[]> {
    const raw = localStorage.getItem(this.BINDINGS_KEY);
    return raw ? (JSON.parse(raw) as SpaceBinding[]) : [];
  }
  
  async bindSpace(binding: SpaceBinding): Promise<void> {
    const bindings = await this.listBindings();
    
    // Remove existing binding for this space if any
    const filtered = bindings.filter(b => b.spaceId !== binding.spaceId);
    
    // Add new binding with all contract details
    filtered.push(binding);
    
    localStorage.setItem(this.BINDINGS_KEY, JSON.stringify(filtered));
  }
  
  async unbindSpace(spaceId: string): Promise<void> {
    const bindings = await this.listBindings();
    const filtered = bindings.filter(b => b.spaceId !== spaceId);
    localStorage.setItem(this.BINDINGS_KEY, JSON.stringify(filtered));
  }
}

export const persistence: PersistenceAdapter = new LocalStorageAdapter();
