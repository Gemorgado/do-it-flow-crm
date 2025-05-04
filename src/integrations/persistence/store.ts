import type { Client, Contact, Interaction, Lead, Location, SpaceBinding, Task } from "@/types";
import type { ConexaSnapshot } from "../conexa/types";
import { locations as mockLocations } from "@/data/locations";
import { supabase } from "../supabase/client";

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
export const loadFromStorage = async () => {
  try {
    // Try to fetch data from Supabase first
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .neq('status', 'converted');
    
    if (!leadsError && leadsData) {
      console.log("Loaded leads from Supabase:", leadsData.length);
      // We don't store in local state as we're using Supabase directly now
    } else {
      console.log("Falling back to localStorage for leads");
      const leadsFromStorage = localStorage.getItem('doitflow_leads');
      if (leadsFromStorage) store.leads = JSON.parse(leadsFromStorage);
    }

    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('*');
      
    if (!clientsError && clientsData) {
      console.log("Loaded clients from Supabase:", clientsData.length);
    } else {
      console.log("Falling back to localStorage for clients");
      const clientsFromStorage = localStorage.getItem('doitflow_clients');
      if (clientsFromStorage) store.clients = JSON.parse(clientsFromStorage);
    }

    // Continue with remaining entities...
    const contactsData = localStorage.getItem('doitflow_contacts');
    if (contactsData) store.contacts = JSON.parse(contactsData);

    const tasksData = localStorage.getItem('doitflow_tasks');
    if (tasksData) store.tasks = JSON.parse(tasksData);

    const interactionsData = localStorage.getItem('doitflow_interactions');
    if (interactionsData) store.interactions = JSON.parse(interactionsData);
    
    const { data: spacesData, error: spacesError } = await supabase
      .from('spaces')
      .select('*');
      
    if (!spacesError && spacesData) {
      console.log("Loaded spaces from Supabase:", spacesData.length);
      store.locations = spacesData.map(space => ({
        id: space.id,
        name: space.name,
        type: space.type,
        floor: space.floor || 1,
        capacity: space.capacity,
        area: space.area,
        description: space.description || '',
        isActive: space.is_active
      }));
    } else {
      console.log("Falling back to localStorage for locations");
      const locationsData = localStorage.getItem('doitflow_locations');
      if (locationsData) {
        store.locations = JSON.parse(locationsData);
      } else {
        // Se não houver dados armazenados, use os dados mockados
        store.locations = [...mockLocations];
        console.log("Usando dados mockados para localizações", store.locations.length);
      }
    }
    
    const { data: bindingsData, error: bindingsError } = await supabase
      .from('space_allocations')
      .select('*');
      
    if (!bindingsError && bindingsData) {
      console.log("Loaded bindings from Supabase:", bindingsData.length);
    } else {
      console.log("Falling back to localStorage for bindings");
      const bindingsFromStorage = localStorage.getItem('doitflow_bindings');
      if (bindingsFromStorage) store.bindings = JSON.parse(bindingsFromStorage);
    }
    
    const snapshotsData = localStorage.getItem('doitflow_snapshots');
    if (snapshotsData) store.snapshots = JSON.parse(snapshotsData);
  } catch (error) {
    console.error('Erro ao carregar dados do armazenamento:', error);
    
    // Em caso de erro, garantir que temos pelo menos os dados mockados para localizações
    store.locations = [...mockLocations];
    console.log("Usando dados mockados após erro", store.locations.length);
  }
};

// Saving to storage is no longer needed as we're using Supabase now
export const saveToStorage = async () => {
  console.log("saveToStorage called - this is a no-op as we're using Supabase now");
  // We'll keep this method for backward compatibility, but it's essentially a no-op now
};

// Log para debug
console.log("Store inicializado");

// Initialize store
loadFromStorage().catch(err => {
  console.error("Failed to initialize store:", err);
});
