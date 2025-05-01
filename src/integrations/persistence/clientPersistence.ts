
import { Client } from "@/types";
import { store, saveToStorage } from "./store";

export const clientPersistence = {
  listClients: async (): Promise<Client[]> => {
    return Promise.resolve([...store.clients]);
  },

  getClient: async (id: string): Promise<Client | undefined> => {
    return Promise.resolve(store.clients.find(client => client.id === id));
  },

  createClient: async (client: Client): Promise<Client> => {
    store.clients.push(client);
    saveToStorage();
    return Promise.resolve(client);
  },

  updateClient: async (client: Client): Promise<Client> => {
    const index = store.clients.findIndex(c => c.id === client.id);
    if (index > -1) {
      store.clients[index] = client;
      saveToStorage();
      return Promise.resolve(client);
    }
    throw new Error(`Cliente com ID ${client.id} não encontrado`);
  },

  deleteClient: async (id: string): Promise<void> => {
    store.clients = store.clients.filter(client => client.id !== id);
    saveToStorage();
    return Promise.resolve();
  }
};
