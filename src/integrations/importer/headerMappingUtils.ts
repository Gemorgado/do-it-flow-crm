
import { InternalField } from './types';

// Common header names used in various spreadsheets
const headerSuggestions: Record<InternalField, string[]> = {
  id: ['ID', 'CNPJ', 'CPF', 'Documento', 'Document', 'Id', 'Identificador'],
  name: ['Nome', 'Nome Cliente', 'Razão Social', 'Cliente', 'Customer', 'Name'],
  plan: ['Plano', 'Serviço', 'Tipo de Serviço', 'Service', 'Plan', 'Service Type'],
  contractStart: ['Data Início', 'Data Inicial', 'Início', 'Start Date', 'Data Início Contrato'],
  contractEnd: ['Data Fim', 'Data Final', 'Término', 'End Date', 'Data Fim Contrato'],
  contractTerm: ['Prazo', 'Prazo Contrato', 'Term', 'Contract Term'],
  contractValue: ['Valor', 'Valor Contrato', 'Preço', 'Amount', 'Value', 'Price'],
  dueDay: ['Dia Vencimento', 'Vencimento', 'Due Day'],
  privateRoom: ['Sala', 'Estação', 'Sala / Estação', 'Room', 'Station'],
  billingEmails: ['Email', 'E-mail', 'E-mails', 'Emails de Cobrança', 'Billing Emails'],
  createdBy: ['Criado Por', 'Autor', 'Created By', 'Author'],
  lastReadjustDate: ['Data Reajuste', 'Último Reajuste', 'Readjust Date'],
  readjustIndex: ['Índice Reajuste', 'Índice', 'Readjust Index'],
  isActive: ['Ativo', 'Status', 'Active']
};

/**
 * Suggests mappings from spreadsheet headers to internal fields
 * @param headers - The headers from the uploaded spreadsheet
 * @returns A mapping from header to internal field
 */
export function suggestColumnMappings(headers: string[]): Record<string, InternalField | ''> {
  const result: Record<string, InternalField | ''> = {};
  
  // For each header, try to find a matching internal field
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().trim();
    let matched = false;
    
    // Check each internal field's suggested headers
    Object.entries(headerSuggestions).some(([field, suggestions]) => {
      if (suggestions.some(suggestion => 
        normalizedHeader === suggestion.toLowerCase() || 
        normalizedHeader.includes(suggestion.toLowerCase())
      )) {
        result[header] = field as InternalField;
        matched = true;
        return true; // break the some() loop
      }
      return false;
    });
    
    // If no match was found, leave it unmapped
    if (!matched) {
      result[header] = '';
    }
  });
  
  return result;
}
