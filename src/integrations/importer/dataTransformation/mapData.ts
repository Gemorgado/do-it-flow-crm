
import { InternalField } from '../types';

/**
 * Maps raw spreadsheet rows to internal field structure using the provided mapping
 */
export function mapRowData(
  rows: Record<string, any>[], 
  mapping: Record<string, InternalField>
): Record<string, any>[] {
  // Process rows using the mapping
  return rows.map(row => {
    const mapped: Record<string, any> = {};
    
    // Apply the mapping to transform column names to internal field names
    Object.entries(mapping).forEach(([column, field]) => {
      mapped[field] = row[column];
    });
    
    return mapped;
  });
}
