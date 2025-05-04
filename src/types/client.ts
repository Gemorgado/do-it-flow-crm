
import { ServiceType } from "./service";

// Client status types
export const CLIENT_STATUS_VALUES = [
  'active',
  'inactive',
  'delinquent',
  'canceled',
] as const;

export type ClientStatus = typeof CLIENT_STATUS_VALUES[number];

// Billing cycle types
export const BILLING_CYCLE_VALUES = [
  'monthly',
  'yearly',
] as const;

export type BillingCycle = typeof BILLING_CYCLE_VALUES[number];

// Map for UI display labels in Portuguese
export const CLIENT_STATUS_DISPLAY_LABELS: Record<ClientStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  delinquent: 'Inadimplente',
  canceled: 'Cancelado',
};

export const BILLING_CYCLE_DISPLAY_LABELS: Record<BillingCycle, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};

// Legacy Portuguese keys to English mapping
export const PT_BR_TO_CLIENT_STATUS: Record<string, ClientStatus> = {
  'ativo': 'active',
  'inativo': 'inactive',
  'inadimplente': 'delinquent',
  'cancelado': 'canceled',
};

export const PT_BR_TO_BILLING_CYCLE: Record<string, BillingCycle> = {
  'mensal': 'monthly',
  'anual': 'yearly',
};

export const CLIENT_STATUS_TO_PT_BR: Record<ClientStatus, string> = {
  active: 'ativo',
  inactive: 'inativo',
  delinquent: 'inadimplente',
  canceled: 'cancelado',
};

export const BILLING_CYCLE_TO_PT_BR: Record<BillingCycle, string> = {
  monthly: 'mensal',
  yearly: 'anual',
};

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  services: ClientService[];
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  assignedTo?: string;
  isActive: boolean;
  
  // Fields for expanded client functionality
  plan?: ServiceType;
  contractStart?: string;
  contractEnd?: string;
  contractTerm?: number;
  contractValue?: number;
  dueDay?: number;
  privateRoom?: string;
  billingEmails?: string[];
  createdBy?: string;
  lastReadjustDate?: string;
  readjustIndex?: string;
}

export interface ClientService {
  id: string;
  clientId: string;
  type: ServiceType;
  description: string;
  locationId: string;
  contractStart: string;
  contractEnd: string;
  value: number;
  billingCycle: BillingCycle;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export const SERVICE_STATUS_VALUES = [
  'active',
  'renewal',
  'canceled',
] as const;

export type ServiceStatus = typeof SERVICE_STATUS_VALUES[number];

export const PT_BR_TO_SERVICE_STATUS: Record<string, ServiceStatus> = {
  'ativo': 'active',
  'em_renovacao': 'renewal',
  'cancelado': 'canceled',
};

export const SERVICE_STATUS_TO_PT_BR: Record<ServiceStatus, string> = {
  active: 'ativo',
  renewal: 'em_renovacao',
  canceled: 'cancelado',
};

// Export ServiceType to make it available to modules importing from client.ts
export type { ServiceType };
