
import type { Client, Interaction, Lead, Location, SpaceBinding, Task } from "@/types";
import type { ConexaSnapshot } from "../conexa/types";

// Define the persistence adapter interface
export interface PersistenceAdapter {
  // Lead methods
  listLeads: () => Promise<Lead[]>;
  getLead: (id: string) => Promise<Lead | undefined>;
  createLead: (lead: Lead) => Promise<Lead>;
  updateLead: (lead: Lead) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;

  // Client methods
  listClients: () => Promise<Client[]>;
  getClient: (id: string) => Promise<Client | undefined>;
  createClient: (client: Client) => Promise<Client>;
  updateClient: (client: Client) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;

  // Task methods
  listTasks: () => Promise<Task[]>;
  getTask: (id: string) => Promise<Task | undefined>;
  createTask: (task: Task) => Promise<Task>;
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;

  // Interaction methods
  listInteractions: () => Promise<Interaction[]>;
  getInteraction: (id: string) => Promise<Interaction | undefined>;
  createInteraction: (interaction: Interaction) => Promise<Interaction>;
  updateInteraction: (interaction: Interaction) => Promise<Interaction>;
  deleteInteraction: (id: string) => Promise<void>;

  // Space methods
  getLocations: () => Promise<Location[]>;
  updateSpace: (space: Location) => Promise<Location>;

  // Space bindings methods
  listBindings: () => Promise<SpaceBinding[]>;
  bindSpace: (binding: SpaceBinding) => Promise<SpaceBinding>;
  updateBinding: (binding: SpaceBinding) => Promise<SpaceBinding>;
  unbindSpace: (spaceId: string) => Promise<void>;

  // Conexa snapshot methods
  upsertSnapshot: (snapshot: ConexaSnapshot) => Promise<void>;
  getLastSnapshot: () => Promise<ConexaSnapshot | null>;
}
