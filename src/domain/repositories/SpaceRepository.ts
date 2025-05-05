
import { Space, NewSpace } from '../models/Space';

export interface SpaceRepository {
  list(): Promise<Space[]>;
  get(id: string): Promise<Space | null>;
  create(space: NewSpace): Promise<Space>;
  update(space: Space): Promise<Space>;
  remove(id: string): Promise<void>;
  getAvailable(): Promise<Space[]>;
}
