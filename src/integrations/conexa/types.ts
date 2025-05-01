
// Types for Conexa integration
export interface ConexaConfig {
  apiKey: string;
  baseUrl: string;
  syncInterval: number; // minutes
}

// Types for Conexa customer
export interface ConexaCustomer {
  id: string;
  name: string;
  docNumber: string;
  email?: string;
  phone?: string;
  updatedAt: string;
}

// API-specific customer type
export interface CustomerApi {
  id: string;
  name: string;
  docNumber: string;
  email?: string;
  phone?: string;
  updatedAt: string;
}

// Types for Conexa service
export interface ConexaService {
  id: string;
  label: string;
  category: string;
  price: number;
  updatedAt: string;
}

// API-specific service type
export interface ServiceApi {
  id: string;
  label: string;
  category: string;
  price: number;
  updatedAt: string;
}

// Types for Conexa contract
export interface ConexaContract {
  id: string;
  customerId: string;
  serviceId: string;
  status: 'active' | 'closed';
  amount: number;
  startDate: string;
  endDate?: string;
  updatedAt: string;
}

// API-specific contract type
export interface ContractApi {
  id: string;
  customerId: string;
  serviceId: string;
  status: 'active' | 'closed';
  amount: number;
  startDate: string;
  endDate?: string;
  updatedAt: string;
}

// Types for room occupation
export interface ConexaRoomOccupation {
  roomId: string;
  contractId: string;
  date: string; // ISO date format
}

// API-specific room occupation type
export interface RoomOccupationApi {
  roomId: string;
  contractId: string;
  date: string; // ISO date format
}

// Types for Conexa sync status
export interface ConexaSyncStatus {
  lastSync: string;
  nextSync: string;
  status: 'connected' | 'disconnected' | 'error';
  syncCount: {
    customers: number;
    contracts: number;
    services: number;
  };
}

// Types for Conexa snapshot
export interface ConexaSnapshot {
  customers: ConexaCustomer[];
  services: ConexaService[];
  contracts: ConexaContract[];
  roomOccupations: ConexaRoomOccupation[];
  syncedAt: string;
}
