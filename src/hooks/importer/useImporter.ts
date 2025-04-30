
import { useState } from 'react';
import { useImportFile } from './useImportFile';
import { useImportProcess } from './useImportProcess';
import type { ImporterState, UseImporterReturn } from './types';
import { ImportStep } from '@/integrations/importer/types';

export function useImporter(): UseImporterReturn {
  const [state, setState] = useState<ImporterState>({
    step: 'upload' as ImportStep,
    file: null,
    headers: [],
    rows: [],
    mapping: {},
    errors: [],
    snapshot: null,
    isProcessing: false
  });

  const { handleFileSelect } = useImportFile(state, setState);
  const {
    handleMappingChange,
    handleImport,
    handleDownloadErrors,
    handleReset,
    handleViewData,
    handleNavigateToStep
  } = useImportProcess(state, setState);

  // Calculate derived state
  const isLoading = state.isProcessing || state.step === 'processing';

  return {
    ...state,
    isLoading,
    handleFileSelect,
    handleMappingChange,
    handleImport,
    handleDownloadErrors,
    handleReset,
    handleViewData,
    handleNavigateToStep
  };
}
