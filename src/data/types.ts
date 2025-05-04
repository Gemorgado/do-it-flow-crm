
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
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired" | "negotiating";
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
  contractId?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  space?: Location | null;
  client?: {
    id: string;
    name: string;
    email: string;
    services: ClientService[];
  } | null;
}

export type { ChartData };
