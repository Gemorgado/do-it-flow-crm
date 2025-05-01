
export const SERVICE_VALUES = [
  'endereco_fiscal',
  'estacao_flex',
  'estacao_fixa',
  'sala_privativa',
  'sala_reuniao',
  'auditorio',
] as const;

export type ServiceType = typeof SERVICE_VALUES[number];
