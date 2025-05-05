
import { ServiceType } from "./service";

export interface SpaceBinding {
  id: string;            // Making id required to match the type in data/types
  spaceId: string;        // id do elemento no mapa (sala ou desk)
  clientId: string;
  contractId?: string | null;
  boundAt: string;       // ISO datetime - Making it required to match data/types
  unitPrice?: number | null;       // Contract price
  startDate: string;      // Contract start date
  endDate?: string | null;         // Contract end date
  notes?: string;         // Optional notes field
  space?: any;           // Space information (optional)
  client?: any;          // Client information (optional)
}
