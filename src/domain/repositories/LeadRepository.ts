
import { Lead, NewLead } from '../models/Lead';

export interface LeadRepository {
  list(): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  create(data: NewLead): Promise<Lead>;
  update(data: Lead): Promise<Lead>;
  remove(id: string): Promise<void>;
  markAsConverted(id: string): Promise<void>;
  listByStage(stageId: string): Promise<Lead[]>;
}
