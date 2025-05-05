
import { LeadStatus, LeadSource } from '@/types/lead';
import { ServiceType } from '@/types/service';
import { ProposalStatus } from '@/types/proposal';
import { BillingCycle, ClientStatus, ServiceStatus } from '@/types/client';

// Service Type mappings
export const toServiceType = (raw: string): ServiceType => {
  const map: Record<string, ServiceType> = {
    endereco_fiscal: 'fiscal_address',
    estacao_flex: 'flex_desk',
    estacao_fixa: 'fixed_desk',
    sala_privativa: 'private_office',
    sala_reuniao: 'meeting_room',
    auditorio: 'auditorium',
  };
  return (map[raw] || raw) as ServiceType;
};

// Lead Status mappings
export const toLeadStatus = (raw: string): LeadStatus => {
  const map: Record<string, LeadStatus> = {
    novo: 'new',
    contatado: 'contacted',
    qualificado: 'qualified',
    proposta: 'proposal',
    negociação: 'negotiation',
    fechado: 'closed_won',
    perdido: 'closed_lost',
    convertido: 'converted',
  };
  return (map[raw] || raw) as LeadStatus;
};

// Lead Source mappings
export const toLeadSource = (raw: string): LeadSource => {
  const map: Record<string, LeadSource> = {
    site_organico: 'site_organic',
    google_ads: 'google_ads',
    meta_ads: 'meta_ads',
    instagram: 'instagram',
    indicacao: 'referral',
    visita_presencial: 'in_person_visit',
    eventos: 'events',
    outros: 'other',
  };
  return (map[raw] || raw) as LeadSource;
};

// Proposal Status mappings
export const toProposalStatus = (raw: string): ProposalStatus => {
  const map: Record<string, ProposalStatus> = {
    enviada: 'sent',
    visualizada: 'viewed',
    aceita: 'accepted',
    rejeitada: 'rejected',
    expirada: 'expired',
    em_negociacao: 'negotiating',
    rascunho: 'draft',
  };
  return (map[raw] || raw) as ProposalStatus;
};

// Client Status mappings
export const toClientStatus = (raw: string): ClientStatus => {
  const map: Record<string, ClientStatus> = {
    ativo: 'active',
    inativo: 'inactive',
    inadimplente: 'delinquent',
    cancelado: 'canceled',
  };
  return (map[raw] || raw) as ClientStatus;
};

// Billing Cycle mappings
export const toBillingCycle = (raw: string): BillingCycle => {
  const map: Record<string, BillingCycle> = {
    mensal: 'monthly',
    anual: 'yearly',
  };
  return (map[raw] || raw) as BillingCycle;
};

// Service Status mappings
export const toServiceStatus = (raw: string): ServiceStatus => {
  const map: Record<string, ServiceStatus> = {
    ativo: 'active',
    em_renovacao: 'renewal',
    cancelado: 'canceled',
  };
  return (map[raw] || raw) as ServiceStatus;
};
