
import { InternalField, ImportError } from '../types';
import { ConexaSnapshot } from '@/integrations/conexa/types';
import { mapRowData } from './mapData';
import { validateRows } from './validateData';
import { snapshotFromRows } from '../transformConexa';
import { generateErrorCSV } from './generateErrorCSV';

export { generateErrorCSV };

/**
 * Main transformation function that processes rows with mapping and returns a snapshot or errors
 */
export function transformRows(
  rows: Record<string, any>[], 
  mapping: Record<string, InternalField>
): { 
  snapshot: ConexaSnapshot | null; 
  errors: ImportError[];
} {
  // Map the raw data to our internal structure
  const mappedRows = mapRowData(rows, mapping);
  
  // Validate rows using Zod schema
  const { validRows, errors } = validateRows(mappedRows, rows);
  
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
