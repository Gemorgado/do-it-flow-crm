
import { useToast } from '@/hooks/use-toast';
import { useFileReader } from './conexa-import/useFileReader';
import { processImportData } from './conexa-import/processImportData';
import { useErrorExport } from './conexa-import/useErrorExport';
import type { ColumnMapping } from './useConexaMapper';
import type { ImportStatus, ImportResults } from './conexa-import/types';

export function useConexaImport() {
  const { toast } = useToast();
  const { status, setStatus, file, results, setResults, readFile } = useFileReader();
  const { downloadErrorsCSV } = useErrorExport();

  const processImport = async (mapping: ColumnMapping): Promise<void> => {
    setStatus('processing');
    
    // Check required fields
    const requiredFields: Array<keyof ColumnMapping> = ['name', 'docNumber', 'serviceType'];
    const missingFields = requiredFields.filter(field => !mapping[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Campos obrigatórios não mapeados',
        description: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      setStatus('mapping');
      return;
    }

    try {
      // Process the data
      const importResults = await processImportData({ 
        mapping, 
        rows: results.rows 
      });
      
      // Update results with the processed data
      setResults({
        ...results,
        processedCount: importResults.processedCount,
        errorRows: importResults.errorRows
      });

      toast({
        title: 'Importação concluída',
        description: `Foram processados ${importResults.processedCount.customers} clientes, ${importResults.processedCount.contracts} contratos e ${importResults.processedCount.services} serviços.`,
      });

      setStatus('success');
    } catch (error) {
      console.error('Error processing import:', error);
      toast({
        title: 'Erro ao processar importação',
        description: String(error),
        variant: 'destructive',
      });
      setStatus('error');
    }
  };

  return {
    status,
    file,
    results,
    readFile,
    processImport,
    downloadErrorsCSV: () => downloadErrorsCSV(results.errorRows)
  };
}
