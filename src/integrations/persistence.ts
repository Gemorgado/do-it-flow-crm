import { Client, Interaction, Lead, Location, SpaceBinding, Task } from "@/types";
import type { ConexaSnapshot } from "./conexa/types";

// Simula um armazenamento persistente
const store = {
  leads: [] as Lead[],
  clients: [] as Client[],
  tasks: [] as Task[],
  interactions: [] as Interaction[],
  locations: [] as Location[],
  bindings: [] as SpaceBinding[],
  snapshots: [] as ConexaSnapshot[]
};

// Carregar dados do localStorage, se existirem
const loadFromStorage = () => {
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
const saveToStorage = () => {
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

// Persistência simulada para leads, clientes, tarefas e interações
export const persistence = {
  
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
  },

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
  },
  
  listTasks: async (): Promise<Task[]> => {
    return Promise.resolve([...store.tasks]);
  },

  getTask: async (id: string): Promise<Task | undefined> => {
    return Promise.resolve(store.tasks.find(task => task.id === id));
  },

  createTask: async (task: Task): Promise<Task> => {
    store.tasks.push(task);
    saveToStorage();
    return Promise.resolve(task);
  },

  updateTask: async (task: Task): Promise<Task> => {
    const index = store.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      store.tasks[index] = task;
      saveToStorage();
      return Promise.resolve(task);
    }
    throw new Error(`Tarefa com ID ${task.id} não encontrada`);
  },

  deleteTask: async (id: string): Promise<void> => {
    store.tasks = store.tasks.filter(task => task.id !== id);
    saveToStorage();
    return Promise.resolve();
  },

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
  },
  
  // Métodos para espaços (locations)
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
  
  // Métodos para vinculações (bindings)
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
  },
  
  // Métodos para snapshots do Conexa
  upsertSnapshot: async (snapshot: ConexaSnapshot): Promise<void> => {
    // Adiciona ou atualiza o snapshot
    const syncDate = snapshot.syncedAt;
    const existingIndex = store.snapshots.findIndex(snap => snap.syncedAt === syncDate);
    
    if (existingIndex !== -1) {
      store.snapshots[existingIndex] = snapshot;
    } else {
      store.snapshots.push(snapshot);
    }
    
    // Manter apenas o snapshot mais recente, limitando o armazenamento
    if (store.snapshots.length > 5) {
      store.snapshots.sort((a, b) => 
        new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
      );
      store.snapshots = store.snapshots.slice(0, 5);
    }
    
    saveToStorage();
    return Promise.resolve();
  },
  
  getLastSnapshot: async (): Promise<ConexaSnapshot | null> => {
    if (store.snapshots.length === 0) {
      return Promise.resolve(null);
    }
    
    // Ordenar snapshots por data e retornar o mais recente
    const sortedSnapshots = [...store.snapshots].sort(
      (a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
    );
    
    return Promise.resolve(sortedSnapshots[0]);
  }
};
