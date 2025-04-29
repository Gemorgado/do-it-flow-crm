
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
  value: number;
  createdAt: string;
  expiresAt: string;
  status: "enviada" | "visualizada" | "aceita" | "rejeitada" | "expirada" | "em_negociacao";
  notes?: string;
  products: ProposalItem[];
}

export interface ProposalItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export { ChartData };
