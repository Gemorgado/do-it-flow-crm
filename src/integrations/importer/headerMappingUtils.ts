
import { InternalField } from './types';
import { SERVICE_OPTIONS } from '@/constants/serviceOptions';

// Dictionary to map column headers to internal fields
const headerMappings: Partial<Record<InternalField, string[]>> = {
  id: ['id', 'código', 'codigo'],
  name: ['nome', 'razão social', 'razao social', 'cliente', 'empresa', 'customer', 'company name'],
  plan: ['plano', 'serviço', 'servico', 'tipo serviço', 'tipo servico', 'service type', 'produto'],
  contractStart: ['início', 'inicio', 'data início', 'data inicio', 'start date', 'start'],
  contractEnd: ['fim', 'término', 'termino', 'data fim', 'end date', 'end'],
  contractTerm: ['fidelidade', 'termo', 'period', 'meses', 'duração', 'duracao'],
  contractValue: ['valor', 'preço', 'preco', 'amount', 'price', 'mensalidade'],
  dueDay: ['vencimento', 'venc', 'dia vencimento', 'due day', 'due date'],
  privateRoom: ['sala privativa', 'sala', 'private room'],
  billingEmails: ['emails', 'e-mails', 'emails financeiros', 'contato financeiro'],
  createdBy: ['cadastrado por', 'created by', 'autor', 'criador'],
  lastReadjustDate: ['reajuste', 'último reajuste', 'data reajuste', 'adjustment date'],
  readjustIndex: ['índice', 'índice reajuste', 'indicador', 'adjustment index'],
  isActive: ['ativo', 'active', 'status', 'situação', 'situacao']
};

// Normalize text by removing accents, spaces, special chars and converting to lowercase
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();
}

// Suggest mappings based on column headers
export function suggestColumnMappings(headers: string[]): Record<string, InternalField> {
  const suggestions: Record<string, InternalField> = {};

  headers.forEach(header => {
    const normalizedHeader = normalizeText(header);
    
    for (const [field, possibleHeaders] of Object.entries(headerMappings)) {
      if (!possibleHeaders) continue;
      
      const match = possibleHeaders.some(possible => 
        normalizeText(possible) === normalizedHeader || 
        normalizedHeader.includes(normalizeText(possible))
      );
      
      if (match) {
        suggestions[header] = field as InternalField;
        break;
      }
    }
  });

  return suggestions;
}

// Validate a specific value against its expected type
export function validateServiceType(value: string): boolean {
  const normalizedValue = normalizeText(value);
  return SERVICE_OPTIONS.some(option => 
    normalizeText(option.label) === normalizedValue || 
    normalizedValue.includes(normalizeText(option.value))
  );
}

// Map external service types to internal enum values
export function mapServiceType(value: string): string | null {
  const normalizedValue = normalizeText(value);
  
  for (const option of SERVICE_OPTIONS) {
    if (
      normalizedValue === normalizeText(option.label) ||
      normalizedValue.includes(normalizeText(option.value))
    ) {
      return option.value;
    }
  }
  
  // Try to match by partial name
  if (normalizedValue.includes('fiscal')) return 'endereco_fiscal';
  if (normalizedValue.includes('privat')) return 'sala_privativa';
  if (normalizedValue.includes('flex')) return 'estacao_flex';
  if (normalizedValue.includes('fixa')) return 'estacao_fixa';
  if (normalizedValue.includes('reuniao') || normalizedValue.includes('reunião')) return 'sala_reuniao';
  if (normalizedValue.includes('audit')) return 'auditorio';
  
  return null;
}
