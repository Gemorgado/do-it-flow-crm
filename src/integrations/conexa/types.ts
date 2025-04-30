
export interface CustomerApi {
  id: string;
  name: string;
  docNumber: string;
  email?: string;
  phone?: string;
  updatedAt: string;
}

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

export interface ServiceApi {
  id: string;
  label: string;
  category: string;
  price: number;
  updatedAt: string;
}

export interface RoomOccupationApi {
  roomId: string;
  contractId: string;
  date: string;            // yyyy-mm-dd
}

export interface ConexaSnapshot {
  customers: CustomerApi[];
  contracts: ContractApi[];
  services: ServiceApi[];
  roomOccupations: RoomOccupationApi[];
  syncedAt: string;         // ISO-datetime
}
