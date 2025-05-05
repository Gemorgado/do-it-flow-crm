
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
    novo: 'novo',
    contatado: 'contatado',
    qualificado: 'qualificado',
    proposta: 'proposta',
    negociação: 'negociação',
    fechado: 'fechado',
    perdido: 'perdido',
    convertido: 'convertido',
    // Map English values from the database to Portuguese types
    new: 'novo',
    contacted: 'contatado',
    qualified: 'qualificado',
    proposal: 'proposta',
    negotiation: 'negociação',
    closed_won: 'fechado',
    closed_lost: 'perdido',
    converted: 'convertido'
  };
  return (map[raw] || raw) as LeadStatus;
};

// Lead Source mappings
export const toLeadSource = (raw: string): LeadSource => {
  const map: Record<string, LeadSource> = {
    site_organico: 'site_organico',
    google_ads: 'google_ads',
    meta_ads: 'meta_ads',
    instagram: 'instagram',
    indicacao: 'indicacao',
    visita_presencial: 'visita_presencial',
    eventos: 'eventos',
    outros: 'outros',
    // Map English values from the database to Portuguese types
    site_organic: 'site_organico',
    referral: 'indicacao',
    in_person_visit: 'visita_presencial',
    events: 'eventos',
    other: 'outros'
  };
  return (map[raw] || raw) as LeadSource;
};

// Proposal Status mappings
export const toProposalStatus = (raw: string): ProposalStatus => {
  const map: Record<string, ProposalStatus> = {
    enviada: 'enviada',
    visualizada: 'visualizada',
    aceita: 'aceita',
    rejeitada: 'rejeitada',
    expirada: 'expirada',
    em_negociacao: 'em_negociacao',
    rascunho: 'rascunho',
    // Map English values to Portuguese types
    draft: 'rascunho',
    sent: 'enviada',
    viewed: 'visualizada',
    accepted: 'aceita',
    rejected: 'rejeitada',
    expired: 'expirada',
    negotiating: 'em_negociacao'
  };
  return (map[raw] || raw) as ProposalStatus;
};

// Client Status mappings
export const toClientStatus = (raw: string): ClientStatus => {
  const map: Record<string, ClientStatus> = {
    ativo: 'ativo',
    inativo: 'inativo',
    inadimplente: 'inadimplente',
    cancelado: 'cancelado',
    // Map English values to Portuguese types
    active: 'ativo',
    inactive: 'inativo',
    delinquent: 'inadimplente',
    canceled: 'cancelado'
  };
  return (map[raw] || raw) as ClientStatus;
};

// Billing Cycle mappings
export const toBillingCycle = (raw: string): BillingCycle => {
  const map: Record<string, BillingCycle> = {
    mensal: 'mensal',
    anual: 'anual',
    // Map English values to Portuguese types
    monthly: 'mensal',
    yearly: 'anual'
  };
  return (map[raw] || raw) as BillingCycle;
};

// Service Status mappings
export const toServiceStatus = (raw: string): ServiceStatus => {
  const map: Record<string, ServiceStatus> = {
    ativo: 'ativo',
    em_renovacao: 'em_renovacao',
    cancelado: 'cancelado',
    // Map English values to Portuguese types
    active: 'ativo',
    renewal: 'em_renovacao',
    canceled: 'cancelado'
  };
  return (map[raw] || raw) as ServiceStatus;
};
