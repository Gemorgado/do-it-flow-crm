
import { InternalField } from './types';

// Field labels for the UI
export const FIELD_LABELS: Record<InternalField, string> = {
  id: 'ID / CNPJ *',
  name: 'Nome do Cliente *',
  plan: 'Plano / Tipo de Serviço *',
  contractStart: 'Data de Início *',
  contractEnd: 'Data de Término',
  contractTerm: 'Prazo do Contrato',
  contractValue: 'Valor do Contrato',
  dueDay: 'Dia de Vencimento',
  privateRoom: 'Sala / Estação',
  billingEmails: 'E-mails para Faturamento',
  createdBy: 'Criado por',
  lastReadjustDate: 'Data do Último Reajuste',
  readjustIndex: 'Índice de Reajuste',
  isActive: 'Ativo'
};

// Required fields for import
export const REQUIRED_FIELDS: InternalField[] = [
  'id',
  'name',
  'plan',
  'contractStart'
];
