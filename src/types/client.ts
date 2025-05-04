
import { ServiceType } from "./service";

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
  billingCycle: "mensal" | "anual";
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export type ServiceStatus = 
  | "ativo" 
  | "em_renovacao" 
  | "cancelado";

// Export ServiceType to make it available to modules importing from client.ts
export { ServiceType };
