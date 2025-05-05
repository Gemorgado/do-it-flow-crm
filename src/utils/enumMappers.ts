
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
    'negociação': 'negociação',
    fechado: 'fechado',
    perdido: 'perdido',
    convertido: 'novo', // Map to existing value
    // Map English values from the database to Portuguese types
    new: 'novo',
    contacted: 'contatado',
    qualified: 'qualificado',
    proposal: 'proposta',
    negotiation: 'negociação',
    closed_won: 'fechado',
    closed_lost: 'perdido',
    converted: 'novo' // Map to existing value
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
    // Convert Portuguese values to English keys defined in types
    'enviada': 'sent',
    'visualizada': 'viewed',
    'aceita': 'accepted',
    'rejeitada': 'rejected',
    'expirada': 'expired',
    'em_negociacao': 'negotiating',
    'rascunho': 'draft',
    // Map English values directly
    'draft': 'draft',
    'sent': 'sent',
    'viewed': 'viewed',
    'accepted': 'accepted',
    'rejected': 'rejected',
    'expired': 'expired',
    'negotiating': 'negotiating'
  };
  return (map[raw] || raw) as ProposalStatus;
};

// Client Status mappings
export const toClientStatus = (raw: string): ClientStatus => {
  const map: Record<string, ClientStatus> = {
    'ativo': 'active',
    'inativo': 'inactive',
    'inadimplente': 'delinquent',
    'cancelado': 'canceled',
    // Map English values directly
    'active': 'active',
    'inactive': 'inactive',
    'delinquent': 'delinquent',
    'canceled': 'canceled'
  };
  return (map[raw] || raw) as ClientStatus;
};

// Billing Cycle mappings
export const toBillingCycle = (raw: string): BillingCycle => {
  const map: Record<string, BillingCycle> = {
    'mensal': 'monthly',
    'anual': 'yearly',
    // Map English values directly
    'monthly': 'monthly',
    'yearly': 'yearly'
  };
  return (map[raw] || raw) as BillingCycle;
};

// Service Status mappings
export const toServiceStatus = (raw: string): ServiceStatus => {
  const map: Record<string, ServiceStatus> = {
    'ativo': 'active',
    'em_renovacao': 'renewal',
    'cancelado': 'canceled',
    // Map English values directly
    'active': 'active',
    'renewal': 'renewal',
    'canceled': 'canceled'
  };
  return (map[raw] || raw) as ServiceStatus;
};
