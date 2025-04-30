
import { ImportStep, ImportError, InternalField } from '@/integrations/importer/types';
import { ConexaSnapshot } from '@/integrations/conexa/types';

export interface ImporterState {
  step: ImportStep;
  file: File | null;
  headers: string[];
  rows: Record<string, any>[];
  mapping: Record<string, InternalField | ''>;
  errors: ImportError[];
  snapshot: ConexaSnapshot | null;
  isProcessing: boolean;
}

export interface UseImporterReturn extends Omit<ImporterState, 'file'> {
  file: File | null;
  isLoading: boolean;
  handleFileSelect: (file: File) => Promise<void>;
  handleMappingChange: (header: string, field: InternalField | '') => void;
  handleImport: () => Promise<void>;
  handleDownloadErrors: () => void;
  handleReset: () => void;
  handleViewData: () => void;
  handleNavigateToStep: (step: ImportStep) => void;
}
