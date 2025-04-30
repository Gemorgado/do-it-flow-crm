
import type { ColumnMapping } from '../useConexaMapper';

/**
 * Common header mappings for Conexa import feature
 * Maps field names to possible header variations in imported spreadsheets
 */
export const commonHeaderMappings: Record<keyof ColumnMapping, string[]> = {
  name: ['nome', 'razão social', 'razao social', 'cliente', 'customer'],
  docNumber: ['cnpj', 'cpf', 'documento', 'document', 'doc number'],
  email: ['email', 'e-mail', 'e mail'],
  phone: ['telefone', 'phone', 'celular', 'tel'],
  serviceType: ['plano', 'serviço', 'servico', 'tipo serviço', 'tipo servico', 'service type'],
  roomNumber: ['sala', 'número sala', 'numero sala', 'espaço', 'espaco', 'room'],
  status: ['status', 'status contrato', 'situação', 'situacao']
};

/**
 * Automatically maps headers from spreadsheet to system fields
 * based on common naming patterns
 */
export function detectColumnMappings(headers: string[]): ColumnMapping {
  if (headers.length === 0) return {};
  
  const newMapping: ColumnMapping = {};
  
  // For each field we need to map
  Object.entries(commonHeaderMappings).forEach(([field, possibleHeaders]) => {
    // Check if any of the headers match our list of possible headers for this field
    const matchedHeader = headers.find(header => {
      const headerLower = header.toLowerCase().trim();
      return possibleHeaders.some(possible => headerLower === possible || headerLower.includes(possible));
    });
    
    if (matchedHeader) {
      newMapping[field as keyof ColumnMapping] = matchedHeader;
    }
  });

  return newMapping;
}
