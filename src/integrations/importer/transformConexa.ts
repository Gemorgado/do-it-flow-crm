
import { parse, format } from 'date-fns';
import { SERVICE_OPTIONS } from '@/constants/serviceOptions';
import type { ConexaSnapshot } from '@/integrations/conexa/types';
import { InternalField } from './types';

// Map service names to internal enum values
const serviceTypeMap: Record<string, string> = {
  'Sala Privativa': 'sala_privativa',
  'Endereço Fiscal': 'endereco_fiscal',
  'Sala de Reunião': 'sala_reuniao',
  'Estação Flex': 'estacao_flex',
  'Estação Fixa': 'estacao_fixa',
  'Auditório': 'auditorio',
};

// Normalize service type to internal enum
function normalizeServiceType(serviceType: string): string {
  return serviceTypeMap[serviceType] || 
         serviceTypeMap[Object.keys(serviceTypeMap).find(k => 
           serviceType.toLowerCase().includes(k.toLowerCase())
         ) as string] || 
         'endereco_fiscal'; // Default fallback
}

// Validate document number (CPF/CNPJ)
function isValidDocNumber(docNumber: string): boolean {
  const digits = String(docNumber).replace(/\D/g, '');
  return digits.length === 11 || digits.length === 14;
}

// Normalize date from various formats to ISO
function normalizeDate(dateString: string): string | undefined {
  if (!dateString) return undefined;
  
  try {
    // Try to parse date from dd/MM/yyyy format
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    try {
      // Try to parse from yyyy-MM-dd format (already ISO)
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Could not parse date:', dateString);
      return undefined;
    }
  }
}

// Extract numeric value from string
function extractNumericValue(value: string | number): number {
  if (typeof value === 'number') return value;
  return Number(String(value).replace(/[^\d]/g, '')) || 0;
}

export function snapshotFromRows(
  rows: Record<string, any>[],
  mapping: Record<string, InternalField>
): { snapshot: ConexaSnapshot | null; errors: Array<{ line: number; reason: string }> } {
  const customers: any[] = [];
  const contracts: any[] = [];
  const services: any[] = [];
  const roomOccupations: any[] = [];
  const errors: Array<{ line: number; reason: string }> = [];
  
  // Create reverse mapping for easier access
  const reverseMapping: Record<InternalField, string> = {} as Record<InternalField, string>;
  Object.entries(mapping).forEach(([key, value]) => {
    reverseMapping[value] = key;
  });

  rows.forEach((row, index) => {
    try {
      // Extract fields using the mapping
      const getValue = (field: InternalField): any => 
        row[reverseMapping[field]] !== undefined ? row[reverseMapping[field]] : null;
      
      const docNumber = String(getValue('id')).replace(/\D/g, ''); // Changed from docNumber to id
      
      // Validate document number
      if (!isValidDocNumber(docNumber)) {
        errors.push({ 
          line: index + 2, // +2 because index is 0-based and we skip header row
          reason: `Invalid document number: ${docNumber} (must have 11 or 14 digits)` 
        });
        return; // Skip this row
      }
      
      const serviceTypeRaw = getValue('plan'); // Changed from serviceType to plan
      const serviceType = normalizeServiceType(serviceTypeRaw);
      
      // Check if service type is valid
      if (!serviceType) {
        errors.push({ 
          line: index + 2,
          reason: `Invalid service type: ${serviceTypeRaw}` 
        });
        return; // Skip this row
      }

      const startDate = normalizeDate(getValue('contractStart'));
      const endDate = normalizeDate(getValue('contractEnd'));
      
      if (!startDate) {
        errors.push({ 
          line: index + 2,
          reason: 'Missing or invalid contract start date' 
        });
        return; // Skip this row
      }

      // Create customer record
      const customerRecord = {
        id: docNumber,
        name: getValue('name'),
        docNumber: docNumber,
        email: getValue('billingEmails'), // Changed from email to billingEmails
        phone: getValue('id'), // Changed from phone to id as placeholder
        updatedAt: new Date().toISOString()
      };
      
      // Only add if customer doesn't already exist (avoid duplicates)
      if (!customers.some(c => c.id === docNumber)) {
        customers.push(customerRecord);
      }

      // Create contract record
      const contractId = `${docNumber}-${startDate}`;
      const contractRecord = {
        id: contractId,
        customerId: docNumber,
        serviceId: serviceType,
        status: 'active',
        amount: extractNumericValue(getValue('contractValue')), // Changed from amount to contractValue
        startDate,
        endDate,
        updatedAt: new Date().toISOString()
      };
      
      contracts.push(contractRecord);

      // Add service if not already in the list
      if (!services.some(s => s.id === serviceType)) {
        // Find the label from SERVICE_OPTIONS
        const serviceOption = SERVICE_OPTIONS.find(opt => opt.value === serviceType);
        services.push({ 
          id: serviceType, 
          label: serviceOption ? serviceOption.label : serviceTypeRaw, 
          category: serviceType, 
          price: extractNumericValue(getValue('contractValue')), // Changed from amount to contractValue
          updatedAt: new Date().toISOString() 
        });
      }

      // Add room occupation if room number exists
      const roomNumber = getValue('privateRoom'); // Changed from roomNumber to privateRoom
      if (roomNumber) {
        roomOccupations.push({ 
          roomId: roomNumber, 
          contractId: contractId, 
          date: startDate 
        });
      }
    } catch (error) {
      console.error('Error processing row:', error);
      errors.push({ 
        line: index + 2,
        reason: `Failed to process row: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  return {
    snapshot: customers.length > 0 ? {
      customers,
      contracts,
      services,
      roomOccupations,
      syncedAt: new Date().toISOString()
    } : null,
    errors
  };
}
