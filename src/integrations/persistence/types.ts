
import { Lead, PipelineStage, Task, Interaction } from "@/types";
import { Client } from "@/types/client";
import { SpaceBinding } from "@/data/types";
import { Location } from "@/types";
import { Contact } from "@/types/contact";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { ConexaSnapshot } from "@/integrations/conexa/types";

export interface PersistenceAdapter {
  // Lead methods
  listLeads: () => Promise<Lead[]>;
  getLead: (id: string) => Promise<Lead | null>;
  createLead: (lead: Lead) => Promise<Lead>;
  updateLead: (lead: Lead) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  createLeads: (leads: Lead[]) => Promise<void>;
  
  // Client methods
  listClients: () => Promise<Client[]>;
  getClient: (id: string) => Promise<Client | null>;
  createClient: (client: Client) => Promise<Client>;
  updateClient: (client: Client) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  createClients: (clients: Client[]) => Promise<void>;
  
  // Task methods
  listTasks: () => Promise<Task[]>;
  getTask: (id: string) => Promise<Task | null>;
  createTask: (task: Task) => Promise<Task>;
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  
  // Interaction methods
  listInteractions: () => Promise<Interaction[]>;
  getInteraction: (id: string) => Promise<Interaction | null>;
  createInteraction: (interaction: Interaction) => Promise<Interaction>;
  updateInteraction: (interaction: Interaction) => Promise<Interaction>;
  deleteInteraction: (id: string) => Promise<void>;
  
  // Space methods
  getLocations: () => Promise<Location[]>;
  getLocation: (id: string) => Promise<Location | null>;
  createSpace: (space: Location) => Promise<Location>;
  updateSpace: (space: Location) => Promise<Location>;
  deleteSpace: (id: string) => Promise<void>;
  
  // Snapshot methods
  getSnapshot: () => Promise<any>;
  saveSnapshot: (data: any) => Promise<void>;
  clearSnapshot: () => Promise<void>;
  getLastSnapshot: () => Promise<ConexaSnapshot | null>;
  upsertSnapshot: (snapshot: ConexaSnapshot) => Promise<void>;
  
  // Proposal methods
  listProposals: () => Promise<any[]>;
  getProposal: (id: string) => Promise<any | null>;
  createProposal: (proposal: any) => Promise<any>;
  updateProposal: (proposal: any) => Promise<any>;
  deleteProposal: (id: string) => Promise<void>;
  
  // Binding methods
  bindSpace: (binding: SpaceBinding) => Promise<SpaceBinding>;
  unbindSpace: (bindingId: string) => Promise<void>;
  listBindings: () => Promise<SpaceBinding[]>;
  getBinding: (id: string) => Promise<SpaceBinding | null>;
  updateBinding: (binding: SpaceBinding) => Promise<SpaceBinding>;
  
  // Contact methods
  listContacts: () => Promise<Contact[]>;
  getContact: (id: string) => Promise<Contact | undefined>;
  createContact: (contactData: ContactModalValues) => Promise<Contact>;
  updateContact: (contact: Contact) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
}
