
import { useState, useEffect } from 'react';
import { detectColumnMappings } from './conexa-import/headerMappingUtils';

export type ColumnMapping = {
  name?: string;
  docNumber?: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  roomNumber?: string;
  status?: string;
};

export type Headers = string[];

/**
 * Hook for managing column mapping in Conexa imports
 * Provides automatic detection of columns based on common header names
 */
export function useConexaMapper(headers: Headers = []) {
  const [mapping, setMapping] = useState<ColumnMapping>({});

  // Auto-detect column mappings based on common headers
  useEffect(() => {
    if (headers.length === 0) return;
    
    const detectedMapping = detectColumnMappings(headers);
    setMapping(detectedMapping);
  }, [headers]);

  return { mapping, setMapping };
}
