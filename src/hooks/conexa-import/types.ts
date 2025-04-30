
import type { ColumnMapping } from '../useConexaMapper';
import type { ConexaSnapshot } from '@/integrations/conexa/types';

export type ImportStatus = 'idle' | 'reading' | 'mapping' | 'processing' | 'success' | 'error';

export interface ImportResults {
  headers: string[];
  rows: Record<string, any>[];
  processedCount: {
    customers: number;
    contracts: number;
    services: number;
    roomOccupations: number;
  };
  errorRows: Array<{
    index: number;
    row: Record<string, any>;
    error: string;
  }>;
}

export interface ProcessImportParams {
  mapping: ColumnMapping;
  rows: Record<string, any>[];
}
