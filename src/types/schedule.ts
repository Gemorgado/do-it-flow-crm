
export type Resource = 'meet1' | 'meet2' | 'meet3' | 'meet4' | 'auditorio';

export interface Reservation {
  id: string;
  resource: Resource;
  title: string;           // ex.: "Reunião Acme"
  start: string;           // ISO (yyyy-mm-ddTHH:MM)
  end: string;             // ISO
  customerId?: string;     // opcional: link com cliente
  createdBy: string;       // usuário
}
