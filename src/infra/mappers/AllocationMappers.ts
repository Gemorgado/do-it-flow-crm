
import { SpaceAllocation, NewSpaceAllocation } from '../../domain/models/Allocation';

export const toDbAllocation = (allocation: NewSpaceAllocation) => {
  return {
    space_id: allocation.spaceId,
    client_id: allocation.clientId,
    contract_id: allocation.contractId,
    start_date: allocation.startDate,
    end_date: allocation.endDate,
    notes: allocation.notes,
    unit_price: allocation.unitPrice,
    status: allocation.status
  };
};

export const toDomainAllocation = (dbAllocation: any): SpaceAllocation => {
  return {
    id: dbAllocation.id,
    spaceId: dbAllocation.space_id,
    clientId: dbAllocation.client_id,
    contractId: dbAllocation.contract_id,
    boundAt: dbAllocation.created_at,
    startDate: dbAllocation.start_date,
    endDate: dbAllocation.end_date,
    notes: dbAllocation.notes,
    unitPrice: dbAllocation.unit_price,
    status: dbAllocation.status || 'active'
  };
};
