
import type { Client, Interaction, Lead, Location, SpaceBinding, Task } from "@/types";
import type { ConexaSnapshot } from "../conexa/types";

// Simula um armazenamento persistente
export const store = {
  leads: [] as Lead[],
  clients: [] as Client[],
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

    const tasksData = localStorage.getItem('doitflow_tasks');
    if (tasksData) store.tasks = JSON.parse(tasksData);

    const interactionsData = localStorage.getItem('doitflow_interactions');
    if (interactionsData) store.interactions = JSON.parse(interactionsData);
    
    const locationsData = localStorage.getItem('doitflow_locations');
    if (locationsData) store.locations = JSON.parse(locationsData);
    
    const bindingsData = localStorage.getItem('doitflow_bindings');
    if (bindingsData) store.bindings = JSON.parse(bindingsData);
    
    const snapshotsData = localStorage.getItem('doitflow_snapshots');
    if (snapshotsData) store.snapshots = JSON.parse(snapshotsData);
  } catch (error) {
    console.error('Erro ao carregar dados do armazenamento local:', error);
  }
};

// Salvar dados no localStorage
export const saveToStorage = () => {
  try {
    localStorage.setItem('doitflow_leads', JSON.stringify(store.leads));
    localStorage.setItem('doitflow_clients', JSON.stringify(store.clients));
    localStorage.setItem('doitflow_tasks', JSON.stringify(store.tasks));
    localStorage.setItem('doitflow_interactions', JSON.stringify(store.interactions));
    localStorage.setItem('doitflow_locations', JSON.stringify(store.locations));
    localStorage.setItem('doitflow_bindings', JSON.stringify(store.bindings));
    localStorage.setItem('doitflow_snapshots', JSON.stringify(store.snapshots));
  } catch (error) {
    console.error('Erro ao salvar dados no armazenamento local:', error);
  }
};

// Carregar dados iniciais
loadFromStorage();
