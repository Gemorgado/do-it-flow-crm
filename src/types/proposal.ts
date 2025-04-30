
import { ServiceType as ServiceOptionType } from '@/constants/serviceOptions';

export type ServiceType = ServiceOptionType;

export interface Proposal {
  id: string;
  companyId: string;
  serviceType: ServiceType;
  amount: number;            // em centavos
  proposalDate: string;      // yyyy-mm-dd
  followUpAt?: string;       // ISO-datetime
  followUpNote?: string;
  ownerId: string;           // ID do usuário responsável
  createdAt: string;
  
  // Additional fields used in the interface
  title?: string;
  leadId?: string;
  value?: number;
  expiresAt?: string;
  status?: string;
  products?: any[];
}

export interface CreateProposalInput {
  companyId: string;
  serviceType: ServiceType;
  amount: number;
  proposalDate: string;
  followUpAt?: string;
  followUpNote?: string;
  ownerId?: string;          // opcional pois pode ser preenchido automaticamente
}

export interface Company {
  id: string;
  name: string;
  docNumber?: string;
  contact?: string;
}
