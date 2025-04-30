
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { transformRows, generateErrorCSV } from '@/integrations/importer/dataTransformation/transformData';
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import { useState } from 'react';
import type { ImporterState } from './types';
import { InternalField, ImportStep } from '@/integrations/importer/types';

export function useImportProcess(
  state: ImporterState,
  setState: (newState: Partial<ImporterState>) => void
) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    setState({ step: 'processing', isProcessing: true });
    
    try {
      // Transform rows using the mapping
      const result = transformRows(state.rows, state.mapping as Record<string, InternalField>);
      
      if (result.errors.length > 0) {
        setState({ 
          errors: result.errors, 
          step: 'error',
          isProcessing: false
        });
        setIsLoading(false);
        return;
      }
      
      if (!result.snapshot) {
        throw new Error('Falha ao processar os dados');
      }
      
      // Process the snapshot
      await processConexaSnapshot(result.snapshot);
      setState({ 
        snapshot: result.snapshot, 
        step: 'complete',
        isProcessing: false
      });
      
      toast({
        title: 'Importação bem-sucedida',
        description: `Foram importados ${result.snapshot.customers.length} clientes e ${result.snapshot.contracts.length} contratos.`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Erro na importação',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      setState({ step: 'error', isProcessing: false });
    } finally {
      setIsLoading(false);
    }
  };

  // Download error report as CSV
  const handleDownloadErrors = () => {
    if (state.errors.length === 0) return;
    
    const csvContent = generateErrorCSV(state.errors);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'erros_importacao.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset the import process
  const handleReset = () => {
    setState({
      file: null,
      headers: [],
      rows: [],
      mapping: {},
      errors: [],
      snapshot: null,
      step: 'upload',
      isProcessing: false
    });
  };
  
  // View the imported data
  const handleViewData = () => {
    navigate('/integrations/conexa');
  };
  
  // Handle navigation between steps
  const handleNavigateToStep = (newStep: ImportStep) => {
    setState({ step: newStep });
  };

  return {
    handleMappingChange: (header: string, field: InternalField | '') => {
      const newMapping = { ...state.mapping };
      if (field === '') {
        delete newMapping[header];
      } else {
        newMapping[header] = field;
      }
      setState({ mapping: newMapping });
    },
    handleImport,
    handleDownloadErrors,
    handleReset,
    handleViewData,
    handleNavigateToStep,
    isLoading
  };
}
