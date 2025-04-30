
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { readSpreadsheet } from '@/integrations/importer/readSpreadsheet';
import { transformRows } from '@/integrations/importer/transformData';
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import { ConexaSnapshot } from '@/integrations/conexa/types';
import { ImportStep, ImportError, InternalField } from '@/integrations/importer/types';
import { TemplateStore } from '@/integrations/importer/templateStore';

export function useImporter() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [mapping, setMapping] = useState<Record<string, InternalField>>({});
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [snapshot, setSnapshot] = useState<ConexaSnapshot | null>(null);

  // Handle file upload
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStep('upload'); // Reset to upload step while reading
    
    try {
      const { headers: fileHeaders, rows: fileRows } = await readSpreadsheet(selectedFile);
      
      if (fileHeaders.length === 0) {
        toast({
          title: 'Erro na leitura do arquivo',
          description: 'Não foi possível detectar as colunas na planilha.',
          variant: 'destructive',
        });
        return;
      }
      
      setHeaders(fileHeaders);
      setRows(fileRows);
      
      // Check if this is a "Relatório de Contratos" file
      const isContratosReport = selectedFile.name.match(/Relatório de Contratos/i) || 
                               (fileHeaders.includes('Razão Social') && 
                                fileHeaders.includes('CNPJ') && 
                                fileHeaders.includes('Data Início Contrato'));
                                
      if (isContratosReport) {
        // Try to find the Conexa template
        const templates = TemplateStore.list();
        const conexaTemplate = templates.find(t => t.name === 'Conexa – Relatório de Contratos') || 
                              templates.find(t => t.id === 'conexa_relatorio_contratos');
        
        if (conexaTemplate) {
          toast({
            title: 'Template encontrado',
            description: 'Utilizando template pré-definido para Relatório de Contratos.',
          });
          
          setMapping(conexaTemplate.columnMap);
          setStep('preview'); // Skip the mapping step
          return;
        }
      }
      
      // If not matched or template not found, proceed to normal mapping
      setStep('mapping');
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: 'Erro na leitura do arquivo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  // Handle mapping changes
  const handleMappingChange = (newMapping: Record<string, InternalField>) => {
    setMapping(newMapping);
  };

  // Process the import
  const handleImport = async () => {
    setStep('processing');
    
    try {
      // Transform rows using the mapping
      const result = transformRows(rows, mapping);
      
      if (result.errors.length > 0) {
        setErrors(result.errors);
        setStep('error');
        return;
      }
      
      if (!result.snapshot) {
        throw new Error('Falha ao processar os dados');
      }
      
      // Process the snapshot
      await processConexaSnapshot(result.snapshot);
      setSnapshot(result.snapshot);
      setStep('complete');
      
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
      setStep('error');
    }
  };

  // Download error report as CSV
  const handleDownloadErrors = () => {
    if (errors.length === 0) return;
    
    const csvContent = generateErrorCSV(errors);
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
    setFile(null);
    setHeaders([]);
    setRows([]);
    setMapping({});
    setErrors([]);
    setSnapshot(null);
    setStep('upload');
  };
  
  // View the imported data
  const handleViewData = () => {
    navigate('/integrations/conexa');
  };

  // Safe condition checks for isLoading
  const isLoading = step === 'processing';
  
  return {
    step,
    file,
    headers,
    rows,
    mapping,
    errors,
    snapshot,
    isLoading,
    handleFileSelect,
    handleMappingChange,
    handleImport,
    handleDownloadErrors,
    handleReset,
    handleViewData
  };
}

// Import this here to avoid circular dependencies
import { generateErrorCSV } from '@/integrations/importer/transformData';
