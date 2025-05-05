
export interface SpaceAllocation {
  id: string;
  spaceId: string;
  clientId: string;
  contractId?: string;
  boundAt: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  unitPrice?: number;
  status: 'active' | 'closed';
}

export interface NewSpaceAllocation extends Omit<SpaceAllocation, 'id' | 'boundAt'> {
  id?: string;
  boundAt?: string;
}

export interface ServiceAllocationInput {
  serviceType: string;
  contractValue: number;
  spaceId?: string;
  startDate: string;
  endDate?: string;
}
