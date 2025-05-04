
import { ServiceType } from "./service";

export interface SpaceBinding {
  id?: string;            
  spaceId: string;        // id do elemento no mapa (sala ou desk)
  clientId: string;
  contractId?: string | null;
  boundAt?: string;       // ISO datetime
  unitPrice?: number | null;       // Contract price
  startDate: string;      // Contract start date
  endDate?: string | null;         // Contract end date
  notes?: string;         // Optional notes field
  space?: any;           // Space information (optional)
  client?: any;          // Client information (optional)
}
