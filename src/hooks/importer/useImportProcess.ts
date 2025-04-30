
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { transformRows, generateErrorCSV } from '@/integrations/importer/transformData';
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import type { ImporterState } from './types';
import { InternalField } from '@/integrations/importer/types';

export function useImportProcess(
  state: ImporterState,
  setState: React.Dispatch<React.SetStateAction<ImporterState>>
) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleMappingChange = (header: string, field: InternalField | '') => {
    const newMapping = { ...state.mapping };
    
    if (field === '') {
      delete newMapping[header];
    } else {
      newMapping[header] = field;
    }
    
    setState(prev => ({ ...prev, mapping: newMapping }));
  };

  const handleImport = async () => {
    setState(prev => ({ ...prev, step: 'processing', isProcessing: true }));
    
    try {
      // Transform rows using the mapping
      const result = transformRows(state.rows, state.mapping);
      
      if (result.errors.length > 0) {
        setState(prev => ({ 
          ...prev, 
          errors: result.errors, 
          step: 'error',
          isProcessing: false
        }));
        return;
      }
      
      if (!result.snapshot) {
        throw new Error('Falha ao processar os dados');
      }
      
      // Process the snapshot
      await processConexaSnapshot(result.snapshot);
      setState(prev => ({ 
        ...prev, 
        snapshot: result.snapshot, 
        step: 'complete',
        isProcessing: false
      }));
      
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
      setState(prev => ({ ...prev, step: 'error', isProcessing: false }));
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
  const handleNavigateToStep = (newStep: ImporterState['step']) => {
    setState(prev => ({ ...prev, step: newStep }));
  };

  return {
    handleMappingChange,
    handleImport,
    handleDownloadErrors,
    handleReset,
    handleViewData,
    handleNavigateToStep
  };
}
