
import { z } from 'zod';
import { InternalField } from './types';
import { snapshotFromRows } from './transformConexa';
import type { ConexaSnapshot } from '@/integrations/conexa/types';
import type { ImportError } from './types';

// Schema for validating each row after mapping
const RowSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  docNumber: z.string().refine(val => {
    const digits = val.replace(/\D/g, '');
    return digits.length === 11 || digits.length === 14;
  }, "Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos"),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  serviceType: z.string().min(1, "Tipo de serviço é obrigatório"),
  roomNumber: z.string().optional().nullable(),
  contractStart: z.string().min(1, "Data de início do contrato é obrigatória"),
  contractEnd: z.string().optional().nullable(),
  amount: z.preprocess(
    v => Number(String(v).replace(/[^\d]/g, '')), 
    z.number().nonnegative("Valor deve ser positivo").optional().nullable()
  )
});

// Generate CSV for errors
export const generateErrorCSV = (errors: ImportError[]): string => {
  const headers = "Linha,Código,Campo,Erro\n";
  
  const rows = errors.flatMap(error => {
    return error.issues.map(issue => {
      const field = issue.path.join('.');
      return `${error.line},"${issue.code}","${field}","${issue.message}"`;
    });
  });
  
  return headers + rows.join('\n');
};

export function transformRows(
  rows: Record<string, any>[], 
  mapping: Record<string, InternalField>
): { 
  snapshot: ConexaSnapshot | null; 
  errors: ImportError[];
} {
  // Ensure mapping is complete with defaults for all InternalFields
  const completeMap: Record<string, InternalField> = { ...mapping };
  
  // Process rows using the mapping
  const mappedRows: Record<string, any>[] = rows.map(row => {
    const mapped: Record<string, any> = {};
    
    // Apply the mapping to transform column names to internal field names
    Object.entries(completeMap).forEach(([column, field]) => {
      mapped[field] = row[column];
    });
    
    return mapped;
  });
  
  // Validate rows using Zod schema
  const errors: ImportError[] = [];
  const validRows: Record<string, any>[] = [];
  
  mappedRows.forEach((row, index) => {
    const result = RowSchema.safeParse(row);
    
    if (result.success) {
      validRows.push(result.data);
    } else {
      errors.push({
        line: index + 2, // +2 for 1-based index and header row
        issues: result.error.issues,
        rawData: row
      });
    }
  });
  
  // If there are errors, return early
  if (errors.length > 0) {
    return { snapshot: null, errors };
  }
  
  // Transform valid rows to Conexa snapshot
  const transformResult = snapshotFromRows(validRows, mapping);
  
  // Merge any errors from the transformation
  if (transformResult.errors.length > 0) {
    transformResult.errors.forEach(error => {
      errors.push({
        line: error.line,
        issues: [{
          code: "custom",
          message: error.reason,
          path: [""]
        }],
        rawData: rows[error.line - 2] // Convert back to 0-based index
      });
    });
  }
  
  return {
    snapshot: transformResult.snapshot,
    errors
  };
}
