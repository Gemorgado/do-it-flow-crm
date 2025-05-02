
import type { Client, Contact, Interaction, Lead, Location, SpaceBinding, Task } from "@/types";
import type { ConexaSnapshot } from "../conexa/types";
import { locations as mockLocations } from "@/data/locations";

// Simula um armazenamento persistente
export const store = {
  leads: [] as Lead[],
  clients: [] as Client[],
  contacts: [] as Contact[],
  tasks: [] as Task[],
  interactions: [] as Interaction[],
  locations: [] as Location[],
  bindings: [] as SpaceBinding[],
  snapshots: [] as ConexaSnapshot[]
};

// Carregar dados do localStorage, se existirem
export const loadFromStorage = () => {
  try {
    const leadsData = localStorage.getItem('doitflow_leads');
    if (leadsData) store.leads = JSON.parse(leadsData);

    const clientsData = localStorage.getItem('doitflow_clients');
    if (clientsData) store.clients = JSON.parse(clientsData);

    const contactsData = localStorage.getItem('doitflow_contacts');
    if (contactsData) store.contacts = JSON.parse(contactsData);

    const tasksData = localStorage.getItem('doitflow_tasks');
    if (tasksData) store.tasks = JSON.parse(tasksData);

    const interactionsData = localStorage.getItem('doitflow_interactions');
    if (interactionsData) store.interactions = JSON.parse(interactionsData);
    
    const locationsData = localStorage.getItem('doitflow_locations');
    if (locationsData) {
      store.locations = JSON.parse(locationsData);
    } else {
      // Se não houver dados armazenados, use os dados mockados
      store.locations = [...mockLocations];
      console.log("Usando dados mockados para localizações", store.locations.length);
    }
    
    const bindingsData = localStorage.getItem('doitflow_bindings');
    if (bindingsData) store.bindings = JSON.parse(bindingsData);
    
    const snapshotsData = localStorage.getItem('doitflow_snapshots');
    if (snapshotsData) store.snapshots = JSON.parse(snapshotsData);
  } catch (error) {
    console.error('Erro ao carregar dados do armazenamento local:', error);
    
    // Em caso de erro, garantir que temos pelo menos os dados mockados para localizações
    store.locations = [...mockLocations];
    console.log("Usando dados mockados após erro", store.locations.length);
  }
};

// Salvar dados no localStorage
export const saveToStorage = () => {
  try {
    localStorage.setItem('doitflow_leads', JSON.stringify(store.leads));
    localStorage.setItem('doitflow_clients', JSON.stringify(store.clients));
    localStorage.setItem('doitflow_contacts', JSON.stringify(store.contacts));
    localStorage.setItem('doitflow_tasks', JSON.stringify(store.tasks));
    localStorage.setItem('doitflow_interactions', JSON.stringify(store.interactions));
    localStorage.setItem('doitflow_locations', JSON.stringify(store.locations));
    localStorage.setItem('doitflow_bindings', JSON.stringify(store.bindings));
    localStorage.setItem('doitflow_snapshots', JSON.stringify(store.snapshots));
    console.log("Dados salvos no localStorage com sucesso");
  } catch (error) {
    console.error('Erro ao salvar dados no armazenamento local:', error);
  }
};

// Garantir que os dados sejam carregados no início
loadFromStorage();

// Log para debug
console.log("Store inicializado com", store.locations.length, "localizações");
