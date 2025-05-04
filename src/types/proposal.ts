
import { ServiceType } from '@/types/service';

// Proposal status types
export const PROPOSAL_STATUS_VALUES = [
  'draft',
  'sent',
  'viewed',
  'accepted', 
  'rejected',
  'expired',
  'negotiating',
] as const;

export type ProposalStatus = typeof PROPOSAL_STATUS_VALUES[number];

// Map for UI display labels in Portuguese
export const PROPOSAL_STATUS_DISPLAY_LABELS: Record<ProposalStatus, string> = {
  draft: 'Rascunho',
  sent: 'Enviada',
  viewed: 'Visualizada',
  accepted: 'Aceita',
  rejected: 'Rejeitada',
  expired: 'Expirada',
  negotiating: 'Em Negociação',
};

// Legacy Portuguese keys to English mapping (for backward compatibility)
export const PT_BR_TO_PROPOSAL_STATUS: Record<string, ProposalStatus> = {
  'enviada': 'sent',
  'visualizada': 'viewed',
  'aceita': 'accepted',
  'rejeitada': 'rejected',
  'expirada': 'expired',
  'em_negociacao': 'negotiating',
};

export const PROPOSAL_STATUS_TO_PT_BR: Record<ProposalStatus, string> = {
  draft: 'enviada',
  sent: 'enviada',
  viewed: 'visualizada',
  accepted: 'aceita',
  rejected: 'rejeitada',
  expired: 'expirada',
  negotiating: 'em_negociacao',
};

export interface Proposal {
  id: string;
  leadId: string;
  companyId?: string;
  serviceType: ServiceType;
  amount?: number;
  title: string;
  value: number;
  proposalDate?: string;      // yyyy-mm-dd
  expiresAt: string;          // ISO-datetime
  followUpAt?: string;        // ISO-datetime
  followUpNote?: string;
  ownerId?: string;           // ID do usuário responsável
  createdAt: string;
  status: ProposalStatus;
  notes?: string;
  products?: any[];
  created_by?: string;        // Add this property for Supabase compatibility
}

export interface CreateProposalInput {
  companyId: string;
  serviceType: ServiceType;
  amount: number;
  proposalDate: string;
  followUpAt?: string;
  followUpNote?: string;
  ownerId?: string;
  
  // Required fields for frontend and database
  title: string;
  leadId: string;
  value: number;
  expiresAt: string;
  status: ProposalStatus;
  notes?: string;
  products?: any[];
  created_by?: string;
}

export interface Company {
  id: string;
  name: string;
  docNumber?: string;
  contact?: string;
}
