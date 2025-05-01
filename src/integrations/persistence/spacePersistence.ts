import { Location, SpaceBinding } from "@/types";
import { store, saveToStorage } from "./store";

export const spacePersistence = {
  // Métodos de espaço
  getLocations: async (): Promise<Location[]> => {
    return Promise.resolve([...store.locations]);
  },
  
  updateSpace: async (updatedSpace: Location): Promise<Location> => {
    console.log("Tentando atualizar espaço com ID:", updatedSpace.id);
    console.log("Espaços atuais:", store.locations);
    
    const index = store.locations.findIndex(space => space.id === updatedSpace.id);
    
    if (index !== -1) {
      // Preserva o ID e outros campos imutáveis
      const originalSpace = store.locations[index];
      store.locations[index] = {
        ...originalSpace,
        ...updatedSpace
      };
      
      saveToStorage();
      console.log("Espaço atualizado com sucesso:", store.locations[index]);
      return store.locations[index];
    }
    
    // Registra informações adicionais para debug quando o espaço não for encontrado
    const existingIds = store.locations.map(space => space.id);
    console.error(`Espaço não encontrado. ID buscado: ${updatedSpace.id}. IDs disponíveis:`, existingIds);
    
    // Se não existir, adicionar à lista (para evitar erros)
    store.locations.push(updatedSpace);
    saveToStorage();
    console.log("Espaço não encontrado, mas foi adicionado:", updatedSpace);
    return updatedSpace;
  },
  
  // Métodos de vinculações de espaço
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
    console.log("Tentando atualizar vinculação para espaço:", binding.spaceId);
    
    const index = store.bindings.findIndex(b => b.spaceId === binding.spaceId);
    
    if (index !== -1) {
      store.bindings[index] = binding;
      saveToStorage();
      console.log("Vinculação atualizada com sucesso:", binding);
      return binding;
    }
    
    // Se não existir, adicionar à lista (para evitar erros)
    store.bindings.push(binding);
    saveToStorage();
    console.log("Vinculação não encontrada, mas foi adicionada:", binding);
    return binding;
  },
  
  unbindSpace: async (spaceId: string): Promise<void> => {
    store.bindings = store.bindings.filter(binding => binding.spaceId !== spaceId);
    saveToStorage();
    
    return Promise.resolve();
  }
};
