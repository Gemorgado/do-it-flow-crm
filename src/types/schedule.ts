
import { Resource as ImportedResource } from "@/constants/resources";

export interface Reservation {
  id: string;
  resource: ImportedResource;
  title: string;           // ex.: "Reunião Acme"
  start: string;           // ISO (yyyy-mm-ddTHH:MM)
  end: string;             // ISO
  customerId?: string;     // opcional: link com cliente
  createdBy: string;       // usuário
}

// Re-export Resource type for components that import from here
export type { ImportedResource as Resource };
