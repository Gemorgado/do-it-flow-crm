
// Define the service types using English snake_case to match Supabase schema
export const SERVICE_VALUES = [
  'fiscal_address',
  'flex_desk',
  'fixed_desk',
  'private_office',
  'meeting_room',
  'auditorium',
] as const;

export type ServiceType = typeof SERVICE_VALUES[number];

// Map for UI display labels in Portuguese
export const SERVICE_DISPLAY_LABELS: Record<ServiceType, string> = {
  fiscal_address: 'Endereço Fiscal',
  flex_desk: 'Estação Flex',
  fixed_desk: 'Estação Fixa',
  private_office: 'Sala Privativa',
  meeting_room: 'Sala de Reunião',
  auditorium: 'Auditório',
};

// Legacy Portuguese keys to English mapping (for backward compatibility)
export const PT_BR_TO_SERVICE_TYPE: Record<string, ServiceType> = {
  endereco_fiscal: 'fiscal_address',
  estacao_flex: 'flex_desk',
  estacao_fixa: 'fixed_desk',
  sala_privativa: 'private_office',
  sala_reuniao: 'meeting_room',
  auditorio: 'auditorium',
};

// English to Portuguese mapping (for backward compatibility)
export const SERVICE_TYPE_TO_PT_BR: Record<ServiceType, string> = {
  fiscal_address: 'endereco_fiscal',
  flex_desk: 'estacao_flex',
  fixed_desk: 'estacao_fixa',
  private_office: 'sala_privativa',
  meeting_room: 'sala_reuniao',
  auditorium: 'auditorio',
};
