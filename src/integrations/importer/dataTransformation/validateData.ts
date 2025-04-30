
import { RowSchema } from './validationSchema';
import { ImportError } from '../types';

/**
 * Validates mapped rows against the schema and returns valid rows and errors
 */
export function validateRows(
  mappedRows: Record<string, any>[],
  originalRows: Record<string, any>[]
): {
  validRows: Record<string, any>[],
  errors: ImportError[]
} {
  const errors: ImportError[] = [];
  const validRows: Record<string, any>[] = [];
  
  mappedRows.forEach((row, index) => {
    const result = RowSchema.safeParse(row);
    
    if (result.success) {
      validRows.push(result.data);
    } else {
      errors.push({
        line: index + 2, // +2 for 1-based index and header row
        issues: result.error.issues.map(issue => ({
          code: issue.code,
          message: issue.message,
          path: issue.path.map(p => String(p))
        })),
        rawData: originalRows[index]
      });
    }
  });
  
  return { validRows, errors };
}
