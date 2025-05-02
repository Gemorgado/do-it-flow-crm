
import { store, saveToStorage } from "./store";
import { v4 as uuidv4 } from "uuid";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { Lead } from "@/types";
import { pipelineStages } from "@/data/leadsData";

// Interface para o objeto de contato no armazenamento
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  idNumber?: string;
  entryDate: string;
  interestService?: string;
  sourceCategory: "indicacao" | "rede_social" | "outro";
  sourceDetail?: string;
  createdAt: string;
  updatedAt: string;
}

// Inicializar o armazenamento de contatos se ainda não existir
if (!store.contacts) {
  store.contacts = [];
}

export const contactPersistence = {
  listContacts: async (): Promise<Contact[]> => {
    return Promise.resolve([...store.contacts]);
  },

  getContact: async (id: string): Promise<Contact | undefined> => {
    return Promise.resolve(store.contacts.find(contact => contact.id === id));
  },

  createContact: async (contactData: ContactModalValues): Promise<Contact> => {
    const now = new Date().toISOString();
    const contact: Contact = {
      id: uuidv4(),
      name: contactData.contactName,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.companyOrPerson,
      idNumber: contactData.idNumber,
      entryDate: contactData.entryDate,
      interestService: contactData.interestService,
      sourceCategory: contactData.sourceCategory as "indicacao" | "rede_social" | "outro",
      sourceDetail: contactData.sourceDetail,
      createdAt: now,
      updatedAt: now
    };
    
    store.contacts.push(contact);
    saveToStorage();
    
    // SEMPRE criar um lead associado ao contato para o pipeline
    const lead: Lead = {
      id: uuidv4(),
      name: contact.name,
      company: contact.company || "",
      email: contact.email,
      phone: contact.phone,
      status: "novo",
      source: mapSourceCategoryToLeadSource(contact.sourceCategory),
      createdAt: now,
      updatedAt: now,
      stage: pipelineStages[0],
      notes: contact.interestService || ""
    };
    
    // Adicionar o novo lead ao store.leads
    if (!store.leads) {
      store.leads = [];
    }
    store.leads.push(lead);
    saveToStorage();
    
    return Promise.resolve(contact);
  },

  updateContact: async (contact: Contact): Promise<Contact> => {
    const index = store.contacts.findIndex(c => c.id === contact.id);
    if (index > -1) {
      contact.updatedAt = new Date().toISOString();
      store.contacts[index] = contact;
      saveToStorage();
      return Promise.resolve(contact);
    }
    throw new Error(`Contato com ID ${contact.id} não encontrado`);
  },

  deleteContact: async (id: string): Promise<void> => {
    store.contacts = store.contacts.filter(contact => contact.id !== id);
    saveToStorage();
    return Promise.resolve();
  }
};

// Função auxiliar para mapear a categoria de origem para o tipo de origem do lead
function mapSourceCategoryToLeadSource(sourceCategory: "indicacao" | "rede_social" | "outro"): any {
  switch (sourceCategory) {
    case "indicacao":
      return "indicacao";
    case "rede_social":
      return "instagram"; // Mapeando para um valor existente em LeadSource
    case "outro":
    default:
      return "outros";
  }
}
