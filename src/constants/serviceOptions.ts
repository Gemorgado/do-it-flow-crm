
import { ServiceType } from "@/types/service";

export const SERVICE_OPTIONS = [
  { value: 'endereco_fiscal', label: 'Endereço Fiscal' },
  { value: 'estacao_flex',    label: 'Estação Flex'   },
  { value: 'estacao_fixa',    label: 'Estação Fixa'   },
  { value: 'sala_privativa',  label: 'Sala Privativa' },
  { value: 'sala_reuniao',    label: 'Sala de Reunião'},
  { value: 'auditorio',       label: 'Auditório'      },
] as const;

// Use "export type" instead of just "export" for re-exporting types when isolatedModules is enabled
export type { ServiceType };
