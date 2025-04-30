export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  stage: PipelineStage;
  assignedTo?: string;
  notes?: string;
  value?: number;
  lastContact?: string;
  nextFollowUp?: string;
  meetingScheduled?: string;
}

export type LeadStatus = 
  | "novo" 
  | "contatado" 
  | "qualificado" 
  | "proposta" 
  | "negociação" 
  | "fechado" 
  | "perdido";

export type LeadSource = 
  | "site_organico" 
  | "google_ads" 
  | "meta_ads" 
  | "instagram" 
  | "indicacao" 
  | "visita_presencial" 
  | "eventos" 
  | "outros";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  services: ClientService[];
  status: "ativo" | "inativo" | "inadimplente" | "cancelado";
  createdAt: string;
  updatedAt: string;
  notes?: string;
  assignedTo?: string;
}

export type ServiceType = 
  | "sala_privativa" 
  | "estacao" 
  | "endereco_fiscal" 
  | "sala_reuniao";

export type ServiceStatus = 
  | "ativo" 
  | "em_renovacao" 
  | "cancelado";

export interface ClientService {
  id: string;
  clientId: string;
  type: ServiceType;
  description: string;
  locationId: string;
  contractStart: string;
  contractEnd: string;
  value: number;
  billingCycle: "mensal" | "anual";
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  type: ServiceType;
  identifier: string;
  available: boolean;
  capacity?: number;
  area?: number;
}

// New interface for space bindings
export interface SpaceBinding {
  spaceId: string;          // id do elemento no mapa (sala ou desk)
  clientId: string;
  contractId: string;
  boundAt: string;          // ISO datetime
}

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

export interface Task {
  id: string;
  contactId?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "baixa" | "média" | "alta";
  status: "pendente" | "em_progresso" | "concluída" | "cancelada";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "comercial" | "atendimento" | "gerente" | "diretor";
  avatar?: string;
  createdAt: string;
  active: boolean;
}

export interface DashboardStats {
  newLeads: number;
  activeClients: number;
  revenueMTD: number;
  leadsConversion: number;
  pendingTasks: number;
  upcomingRenewals: number;
  meetingsScheduled: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}
