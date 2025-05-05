
export type ClientStatus = 'active' | 'inactive' | 'delinquent' | 'canceled';
export type BillingCycle = 'monthly' | 'yearly';
export type ServiceStatus = 'active' | 'renewal' | 'canceled';
export type ServiceType = 
  | 'fiscal_address'
  | 'flex_desk'
  | 'fixed_desk'
  | 'private_office'
  | 'meeting_room'
  | 'auditorium';

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

export interface NewClientService extends Omit<ClientService, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

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

export interface NewClient extends Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'services'> {
  id?: string;
  services?: NewClientService[];
}
