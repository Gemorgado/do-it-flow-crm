
import { ServiceType } from "./service";

export interface SpaceBinding {
  spaceId: string;          // id do elemento no mapa (sala ou desk)
  clientId: string;
  contractId: string;
  boundAt: string;          // ISO datetime
  unitPrice?: number | null;       // Contract price
  startDate?: string | null;       // Contract start date
  endDate?: string | null;         // Contract end date
  id?: string;             // Optional ID for persistence
  notes?: string;          // Optional notes field
}
