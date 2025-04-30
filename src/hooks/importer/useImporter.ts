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
  const [mapping, setMapping] = useState<Record<string, InternalField>>({});
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [snapshot, setSnapshot] = useState<ConexaSnapshot | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { importFile, isImporting } = useImportFile();
  const { processImport, isProcessing: isImportProcessing } = useImportProcess();

  // Only update the mapping change handler to match new signature
  const handleMappingChange = useCallback((mapping: Record<string, InternalField | ''>) => {
    setMapping(prev => ({
      ...prev,
      ...mapping
    }));
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setFile(file);
    setIsProcessing(true);
    
    try {
      const { headers, rows } = await importFile(file);
      setHeaders(headers);
      setRows(rows);
      setStep('mapping');
    } catch (error) {
      console.error('Error importing file:', error);
      setErrors([{
        line: 0,
        issues: [{
          code: 'import_error',
          message: 'Failed to import file. Please check the format and try again.',
          path: []
        }]
      }]);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [importFile]);

  const handleImport = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      const result = await processImport(rows, mapping);
      
      if (result.errors.length > 0) {
        setErrors(result.errors);
        setStep('error');
      } else {
        setSnapshot(result.snapshot);
        setStep('complete');
      }
    } catch (error) {
      console.error('Error processing import:', error);
      setErrors([{
        line: 0,
        issues: [{
          code: 'process_error',
          message: 'Failed to process data. Please try again.',
          path: []
        }]
      }]);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [rows, mapping, processImport]);

  const handleDownloadErrors = useCallback(() => {
    // Implementation for downloading errors as CSV
    // This would typically use the generateErrorCSV function
  }, [errors]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setHeaders([]);
    setRows([]);
    setMapping({});
    setErrors([]);
    setSnapshot(null);
  }, []);

  const handleViewData = useCallback(() => {
    // Navigate to data view page or open modal
    // Implementation depends on app navigation
  }, [snapshot]);

  const handleNavigateToStep = useCallback((newStep: ImportStep) => {
    setStep(newStep);
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
    isLoading: isImporting || isImportProcessing || isProcessing,
    handleFileSelect,
    handleMappingChange,
    handleImport,
    handleDownloadErrors,
    handleReset,
    handleViewData,
    handleNavigateToStep
  };
}
