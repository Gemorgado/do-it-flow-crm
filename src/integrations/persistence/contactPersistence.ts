
import { store, saveToStorage } from "./store";
import { v4 as uuidv4 } from "uuid";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { Contact } from "@/types/contact";

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
    
    console.log("Creating new contact:", contact);
    
    store.contacts.push(contact);
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
