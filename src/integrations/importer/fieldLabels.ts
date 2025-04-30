
import { InternalField } from './types';

export const FIELD_LABELS: Record<InternalField, string> = {
  id: 'ID',
  name: 'Cliente *',
  plan: 'Plano *',
  contractStart: 'Início do Contrato',
  contractEnd: 'Fim do Contrato',
  contractTerm: 'Fidelidade (meses)',
  contractValue: 'Valor',
  dueDay: 'Venc. (dia)',
  privateRoom: 'Sala Privativa',
  billingEmails: 'E-mails avisos financeiros',
  createdBy: 'Cadastrado Por',
  lastReadjustDate: 'Último Reajuste',
  readjustIndex: 'Índice de Reajuste',
  isActive: 'Ativo *',
};

export const REQUIRED_FIELDS: InternalField[] = ['name', 'plan', 'isActive'];
