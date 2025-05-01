
import { Location, SpaceBinding } from "@/types";
import { store, saveToStorage } from "./store";

export const spacePersistence = {
  // Space methods
  getLocations: async (): Promise<Location[]> => {
    return Promise.resolve([...store.locations]);
  },
  
  updateSpace: async (updatedSpace: Location): Promise<Location> => {
    const index = store.locations.findIndex(space => space.id === updatedSpace.id);
    
    if (index !== -1) {
      store.locations[index] = updatedSpace;
      saveToStorage();
      return updatedSpace;
    }
    
    throw new Error(`Espaço com ID ${updatedSpace.id} não encontrado`);
  },
  
  // Space bindings methods
  listBindings: async (): Promise<SpaceBinding[]> => {
    return Promise.resolve([...store.bindings]);
  },
  
  bindSpace: async (binding: SpaceBinding): Promise<SpaceBinding> => {
    // Remove qualquer vinculação existente para este espaço
    store.bindings = store.bindings.filter(b => b.spaceId !== binding.spaceId);
    
    // Adiciona a nova vinculação
    store.bindings.push(binding);
    saveToStorage();
    
    return binding;
  },
  
  updateBinding: async (binding: SpaceBinding): Promise<SpaceBinding> => {
    const index = store.bindings.findIndex(b => b.spaceId === binding.spaceId);
    
    if (index !== -1) {
      store.bindings[index] = binding;
      saveToStorage();
      return binding;
    }
    
    throw new Error(`Vinculação para o espaço ${binding.spaceId} não encontrada`);
  },
  
  unbindSpace: async (spaceId: string): Promise<void> => {
    store.bindings = store.bindings.filter(binding => binding.spaceId !== spaceId);
    saveToStorage();
    
    return Promise.resolve();
  }
};
