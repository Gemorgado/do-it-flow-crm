
export type ServiceType = 
  | "sala_privativa" 
  | "estacao" 
  | "endereco_fiscal" 
  | "sala_reuniao"
  | "estacao_flex"
  | "estacao_fixa"
  | "auditorio";

export const SERVICE_VALUES: ServiceType[] = [
  "sala_privativa",
  "estacao",
  "estacao_flex",
  "estacao_fixa", 
  "endereco_fiscal",
  "sala_reuniao",
  "auditorio"
];

export interface Client {
  id: string;
  name: string;
  plan?: ServiceType;
  contractStart?: string;   // yyyy-mm-dd
  contractEnd?: string;
  contractTerm?: number;
  contractValue?: number;
  dueDay?: number;
  privateRoom?: string;
  billingEmails?: string[];
  createdBy?: string;
  lastReadjustDate?: string;
  readjustIndex?: string;
  isActive: boolean;
  
  // Keep compatibility with existing fields
  company: string;
  email: string;
  phone: string;
  address?: string;
  services: any[];
  status: "ativo" | "inativo" | "inadimplente" | "cancelado";
  createdAt: string;
  updatedAt: string;
  notes?: string;
  assignedTo?: string;
}
