
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

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  sourceDetail?: string;
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
