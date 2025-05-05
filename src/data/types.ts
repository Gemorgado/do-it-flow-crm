
import { 
  Lead, 
  LeadStatus, 
  LeadSource, 
  Client, 
  ServiceType, 
  ServiceStatus, 
  Location, 
  ClientService,
  PipelineStage,
  User,
  Task,
  DashboardStats,
  ChartData
} from "@/types";

export interface Interaction {
  id: string;
  contactId: string;
  type: "email" | "call" | "meeting" | "whatsapp" | "visit" | "other";
  date: string;
  notes: string;
  createdBy: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

export interface Proposal {
  id: string;
  leadId: string;
  title: string;
  value: number; // in cents
  createdAt: string;
  expiresAt: string;
  status: "enviada" | "visualizada" | "aceita" | "rejeitada" | "expirada" | "em_negociacao";
  notes?: string;
  products: ProposalItem[];
  created_by?: string; // For Supabase compatibility
}

export interface ProposalItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number; // in cents
  total: number; // in cents
}

export interface SpaceBinding {
  id: string;
  spaceId: string;
  clientId: string;
  contractId?: string | null;
  boundAt: string; // Required property
  startDate: string;
  endDate?: string | null;
  notes?: string;
  unitPrice?: number | null;
  space?: Location | null;
  client?: {
    id: string;
    name: string;
    email: string;
    services: ClientService[];
  } | null;
}

// Re-export the Location type to solve the import error
export type { ChartData, Location };

