
import { z } from 'zod';
import { InternalField, ImportError } from './types';
import { ConexaSnapshot } from '@/integrations/conexa/types';
import { mapServiceType } from './headerMappingUtils';
import { SERVICE_OPTIONS } from '@/constants/serviceOptions';
import { v4 as uuidv4 } from 'uuid';

// Define validation schema for imported data
const serviceTypeValues = SERVICE_OPTIONS.map(opt => opt.value);

const RowSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  docNumber: z.string().min(8, { message: "Documento deve ter pelo menos 8 caracteres" }),
  serviceType: z.enum(serviceTypeValues as [string, ...string[]], {
    errorMap: () => ({ message: `Tipo de serviço deve ser um dos valores: ${serviceTypeValues.join(', ')}` })
  }),
  email: z.string().email({ message: "Email inválido" }).optional().nullable(),
  phone: z.string().optional().nullable(),
  roomNumber: z.string().optional().nullable(),
  contractStart: z.string().optional().nullable(),
  contractEnd: z.string().optional().nullable(),
  amount: z.preprocess(
    v => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      // Convert string like "R$ 1.234,56" to number 123456
      return Number(String(v).replace(/[^\d,.-]/g, '').replace(',', '.'));
    }, 
    z.number().nonnegative().optional()
  )
});

export type ValidRow = z.infer<typeof RowSchema>;

export function transformRows(
  rows: Record<string, any>[],
  mapping: Record<string, InternalField>
): {
  snapshot: ConexaSnapshot | null;
  errors: ImportError[];
} {
  const errors: ImportError[] = [];
  const validRows: ValidRow[] = [];
  
  // Reverse mapping for easy access
  const columnMapping: Record<InternalField, string> = {};
  Object.entries(mapping).forEach(([column, field]) => {
    columnMapping[field] = column;
  });
  
  // Process each row
  rows.forEach((row, idx) => {
    try {
      // Map columns to fields
      const mappedData: Partial<Record<InternalField, any>> = {};
      
      Object.entries(columnMapping).forEach(([field, column]) => {
        let value = row[column];
        
        // Special handling for serviceType
        if (field === 'serviceType' && value) {
          value = mapServiceType(value) || value;
        }
        
        mappedData[field as InternalField] = value;
      });
      
      // Validate the mapped data
      const parseResult = RowSchema.safeParse(mappedData);
      
      if (!parseResult.success) {
        errors.push({
          line: idx + 2, // +2 because idx is 0-based and we skip header row
          issues: parseResult.error.errors,
          rawData: row
        });
      } else {
        validRows.push(parseResult.data);
      }
    } catch (error) {
      errors.push({
        line: idx + 2,
        issues: [{ code: 'custom', message: String(error), path: [] }],
        rawData: row
      });
    }
  });
  
  // If there are errors, return them
  if (errors.length > 0) {
    return { snapshot: null, errors };
  }
  
  // Convert valid rows to ConexaSnapshot
  return {
    snapshot: createConexaSnapshot(validRows),
    errors
  };
}

function createConexaSnapshot(rows: ValidRow[]): ConexaSnapshot {
  const snapshot: ConexaSnapshot = {
    customers: [],
    contracts: [],
    services: [],
    roomOccupations: [],
    syncedAt: new Date().toISOString()
  };
  
  // Map to track customers by docNumber to avoid duplicates
  const customerMap = new Map<string, string>();
  // Map to track services by serviceType
  const serviceMap = new Map<string, string>();
  
  rows.forEach(row => {
    // Create or reuse customer ID
    let customerId: string;
    if (customerMap.has(row.docNumber)) {
      customerId = customerMap.get(row.docNumber)!;
    } else {
      customerId = `cust_${row.docNumber.replace(/\D/g, '')}`;
      customerMap.set(row.docNumber, customerId);
      
      snapshot.customers.push({
        id: customerId,
        name: row.name,
        docNumber: row.docNumber,
        email: row.email || undefined,
        phone: row.phone || undefined,
        updatedAt: new Date().toISOString()
      });
    }
    
    // Create or reuse service ID
    let serviceId: string;
    if (serviceMap.has(row.serviceType)) {
      serviceId = serviceMap.get(row.serviceType)!;
    } else {
      serviceId = `svc_${row.serviceType}`;
      serviceMap.set(row.serviceType, serviceId);
      
      snapshot.services.push({
        id: serviceId,
        label: SERVICE_OPTIONS.find(opt => opt.value === row.serviceType)?.label || row.serviceType,
        category: 'imported',
        price: row.amount || 0,
        updatedAt: new Date().toISOString()
      });
    }
    
    // Create contract
    const contractId = `contract_${customerId}_${serviceId}_${uuidv4().split('-')[0]}`;
    snapshot.contracts.push({
      id: contractId,
      customerId,
      serviceId,
      status: 'active',
      amount: row.amount || 0,
      startDate: row.contractStart || new Date().toISOString().split('T')[0],
      endDate: row.contractEnd,
      updatedAt: new Date().toISOString()
    });
    
    // Add room occupation if room number is provided
    if (row.roomNumber) {
      snapshot.roomOccupations.push({
        roomId: row.roomNumber,
        contractId,
        date: row.contractStart || new Date().toISOString().split('T')[0]
      });
    }
  });
  
  return snapshot;
}

export function generateErrorCSV(errors: ImportError[]): string {
  if (errors.length === 0) return '';
  
  // Get all unique field paths from error issues for headers
  const uniqueFields = new Set<string>();
  const allIssues = new Set<string>();
  
  errors.forEach(err => {
    err.issues.forEach(issue => {
      allIssues.add(issue.code);
      issue.path.forEach(path => uniqueFields.add(String(path)));
    });
    
    if (err.rawData) {
      Object.keys(err.rawData).forEach(key => uniqueFields.add(key));
    }
  });
  
  const headers = ['Line', 'Error'];
  const fieldsArray = Array.from(uniqueFields);
  headers.push(...fieldsArray);
  
  // Build CSV
  const csvRows = [headers.join(',')];
  
  errors.forEach(err => {
    const errorMessages = err.issues.map(issue => issue.message).join('; ');
    const rowData: string[] = [err.line.toString(), `"${errorMessages.replace(/"/g, '""')}"`];
    
    // Add data for each field
    fieldsArray.forEach(field => {
      const value = err.rawData?.[field] || '';
      rowData.push(`"${String(value).replace(/"/g, '""')}"`);
    });
    
    csvRows.push(rowData.join(','));
  });
  
  return csvRows.join('\n');
}
