
import { Interaction } from "@/types";
import { store, saveToStorage } from "./store";

export const interactionPersistence = {
  listInteractions: async (): Promise<Interaction[]> => {
    return Promise.resolve([...store.interactions]);
  },

  getInteraction: async (id: string): Promise<Interaction | undefined> => {
    return Promise.resolve(store.interactions.find(interaction => interaction.id === id));
  },

  createInteraction: async (interaction: Interaction): Promise<Interaction> => {
    store.interactions.push(interaction);
    saveToStorage();
    return Promise.resolve(interaction);
  },

  updateInteraction: async (interaction: Interaction): Promise<Interaction> => {
    const index = store.interactions.findIndex(i => i.id === interaction.id);
    if (index > -1) {
      store.interactions[index] = interaction;
      saveToStorage();
      return Promise.resolve(interaction);
    }
    throw new Error(`Interação com ID ${interaction.id} não encontrada`);
  },

  deleteInteraction: async (id: string): Promise<void> => {
    store.interactions = store.interactions.filter(interaction => interaction.id !== id);
    saveToStorage();
    return Promise.resolve();
  }
};
