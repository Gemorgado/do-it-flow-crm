
import { Lead } from "@/types";
import { store, saveToStorage } from "./store";

export const leadPersistence = {
  listLeads: async (): Promise<Lead[]> => {
    return Promise.resolve([...store.leads]);
  },

  getLead: async (id: string): Promise<Lead | undefined> => {
    return Promise.resolve(store.leads.find(lead => lead.id === id));
  },

  createLead: async (lead: Lead): Promise<Lead> => {
    store.leads.push(lead);
    saveToStorage();
    return Promise.resolve(lead);
  },

  updateLead: async (lead: Lead): Promise<Lead> => {
    const index = store.leads.findIndex(l => l.id === lead.id);
    if (index > -1) {
      store.leads[index] = lead;
      saveToStorage();
      return Promise.resolve(lead);
    }
    throw new Error(`Lead com ID ${lead.id} não encontrado`);
  },

  deleteLead: async (id: string): Promise<void> => {
    store.leads = store.leads.filter(lead => lead.id !== id);
    saveToStorage();
    return Promise.resolve();
  }
};
