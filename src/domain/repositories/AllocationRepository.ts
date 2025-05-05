
import { SpaceAllocation, NewSpaceAllocation } from '../models/Allocation';

export interface AllocationRepository {
  list(): Promise<SpaceAllocation[]>;
  getByClient(clientId: string): Promise<SpaceAllocation[]>;
  getBySpace(spaceId: string): Promise<SpaceAllocation[]>;
  create(allocation: NewSpaceAllocation): Promise<SpaceAllocation>;
  update(allocation: SpaceAllocation): Promise<SpaceAllocation>;
  remove(id: string): Promise<void>;
}
