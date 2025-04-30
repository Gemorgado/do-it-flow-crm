
import { useState, useCallback } from 'react';
import { ImportStep, InternalField, ImportError } from '@/integrations/importer/types';
import { useImportFile } from './useImportFile';
import { useImportProcess } from './useImportProcess';
import { ConexaSnapshot } from '@/integrations/conexa/types';
import { UseImporterReturn } from './types';

export function useImporter(): UseImporterReturn {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [mapping, setMapping] = useState<Record<string, InternalField | ''>>({});
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [snapshot, setSnapshot] = useState<ConexaSnapshot | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const state = {
    step,
    file,
    headers,
    rows,
    mapping,
    errors,
    snapshot,
    isProcessing
  };

  const setState = useCallback((newState: any) => {
    if ('step' in newState) setStep(newState.step);
    if ('file' in newState) setFile(newState.file);
    if ('headers' in newState) setHeaders(newState.headers);
    if ('rows' in newState) setRows(newState.rows);
    if ('mapping' in newState) setMapping(newState.mapping);
    if ('errors' in newState) setErrors(newState.errors);
    if ('snapshot' in newState) setSnapshot(newState.snapshot);
    if ('isProcessing' in newState) setIsProcessing(newState.isProcessing);
  }, []);

  // Pass state and setState to hooks
  const fileImporter = useImportFile(state, setState);
  const importProcessor = useImportProcess(state, setState);
  
  // Handle individual field mapping
  const handleMappingChange = useCallback((header: string, field: InternalField | '') => {
    setMapping(prev => {
      const newMapping = { ...prev };
      
      if (field === '') {
        delete newMapping[header];
      } else {
        newMapping[header] = field;
      }
      
      return newMapping;
    });
  }, []);

  return {
    step,
    file,
    headers,
    rows,
    mapping,
    errors,
    snapshot,
    isProcessing,
    isLoading: isProcessing || fileImporter.isLoading || importProcessor.isLoading,
    handleFileSelect: fileImporter.handleFileSelect,
    handleMappingChange,
    handleImport: importProcessor.handleImport,
    handleDownloadErrors: importProcessor.handleDownloadErrors,
    handleReset: importProcessor.handleReset,
    handleViewData: importProcessor.handleViewData,
    handleNavigateToStep: importProcessor.handleNavigateToStep
  };
}
