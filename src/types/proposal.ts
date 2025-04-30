
export type ServiceType =
  | 'endereços_fiscais'
  | 'salas_privadas'
  | 'coworking_flex'
  | 'consultoria'
  | 'outro';

export interface Proposal {
  id: string;
  companyId: string;
  serviceType: ServiceType;
  amount: number;            // em centavos
  proposalDate: string;      // yyyy-mm-dd
  followUpAt?: string;       // ISO-datetime
  followUpNote?: string;
  createdAt: string;
}

export interface CreateProposalInput {
  companyId: string;
  serviceType: ServiceType;
  amount: number;
  proposalDate: string;
  followUpAt?: string;
  followUpNote?: string;
}

export interface Company {
  id: string;
  name: string;
}
