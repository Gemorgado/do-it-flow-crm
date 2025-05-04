
export const SERVICE_VALUES = [
  'endereco_fiscal',
  'estacao_flex',
  'estacao_fixa',
  'sala_privativa',
  'sala_reuniao',
  'auditorio',
] as const;

export type ServiceType = typeof SERVICE_VALUES[number];

// Map for converting between frontend and backend service types
export const SERVICE_TYPE_MAP = {
  // Frontend to backend
  endereco_fiscal: 'fiscal_address',
  estacao_flex: 'flex_desk',
  estacao_fixa: 'fixed_desk',
  sala_privativa: 'private_office',
  sala_reuniao: 'meeting_room',
  auditorio: 'auditorium',
  
  // Backend to frontend
  fiscal_address: 'endereco_fiscal',
  flex_desk: 'estacao_flex',
  fixed_desk: 'estacao_fixa',
  private_office: 'sala_privativa',
  meeting_room: 'sala_reuniao',
  auditorium: 'auditorio'
} as const;
