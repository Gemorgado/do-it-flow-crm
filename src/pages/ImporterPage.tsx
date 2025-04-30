
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { readSpreadsheet } from '@/integrations/importer/readSpreadsheet';
import { transformRows, generateErrorCSV } from '@/integrations/importer/transformData';
import { ImportStep, ImportError, PreviewData } from '@/integrations/importer/types';
import { InternalField } from '@/integrations/importer/types';
import { ConexaSnapshot } from '@/integrations/conexa/types';
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import { useNavigate } from 'react-router-dom';

// Import steps
import { UploadStep } from './Importer/UploadStep';
import { MappingStep } from './Importer/MappingStep';
import { PreviewStep } from './Importer/PreviewStep';
import { ErrorStep } from './Importer/ErrorStep';
import { SuccessStep } from './Importer/SuccessStep';

export default function ImporterPage() {
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

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Importação de Dados</h1>
      <p className="text-muted-foreground mb-6">
        Importe dados de clientes, contratos e serviços a partir de planilhas.
      </p>
      
      <div className="mb-8">
        {step === 'upload' && (
          <UploadStep 
            onFileSelect={handleFileSelect} 
            isLoading={isLoading}
          />
        )}
        
        {step === 'mapping' && (
          <MappingStep
            headers={headers}
            previewRows={rows.slice(0, 5)}
            initialMapping={mapping}
            onMappingChange={handleMappingChange}
            onContinue={() => setStep('preview')}
            onBack={handleReset}
          />
        )}
        
        {step === 'preview' && (
          <PreviewStep
            mapping={mapping}
            previewRows={rows.slice(0, 5)}
            onBack={() => setStep('mapping')}
            onImport={handleImport}
            isLoading={isLoading}
          />
        )}
        
        {step === 'error' && (
          <ErrorStep
            errors={errors}
            onDownloadErrors={handleDownloadErrors}
            onBack={handleReset}
          />
        )}
        
        {step === 'complete' && snapshot && (
          <SuccessStep
            snapshot={snapshot}
            onReset={handleReset}
            onViewData={handleViewData}
          />
        )}
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Como funciona</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="font-medium">1. Envie sua planilha</div>
            <p className="text-sm text-muted-foreground mt-1">
              Carregue uma planilha no formato Excel ou CSV com seus dados.
            </p>
          </div>
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="font-medium">2. Mapeie as colunas</div>
            <p className="text-sm text-muted-foreground mt-1">
              Associe as colunas da sua planilha aos campos do sistema ou use um template salvo.
            </p>
          </div>
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="font-medium">3. Importe os dados</div>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize e confirme a importação para adicionar os dados ao sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
