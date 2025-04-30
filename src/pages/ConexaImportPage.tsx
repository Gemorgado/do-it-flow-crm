
import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';
import { useConexaImport } from '@/hooks/useConexaImport';
import { useConexaMapper } from '@/hooks/useConexaMapper';

import { FileUploader } from '@/components/ConexaImport/FileUploader';
import { ColumnMapping } from '@/components/ConexaImport/ColumnMapping';
import { ResultsDisplay } from '@/components/ConexaImport/ResultsDisplay';
import { ImportTips } from '@/components/ConexaImport/ImportTips';
import { ImportActions } from '@/components/ConexaImport/ImportActions';
import { ImportError } from '@/components/ConexaImport/ImportError';

export default function ConexaImportPage() {
  const { status, file, results, readFile, processImport, downloadErrorsCSV } = useConexaImport();
  const { mapping, setMapping } = useConexaMapper(results.headers);
  const requiredFields = ['name', 'docNumber', 'serviceType'];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      readFile(acceptedFiles[0]);
    }
  }, [readFile]);

  const handleMappingChange = (field: string, value: string | null) => {
    setMapping(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleImport = () => {
    processImport(mapping);
  };

  const handleCancel = () => {
    window.location.href = "/integrations";
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  const getCardContent = () => {
    if (status === 'idle' || status === 'reading') {
      return <FileUploader onDrop={onDrop} isLoading={status === 'reading'} />;
    }
    
    if (status === 'mapping') {
      return (
        <ColumnMapping 
          headers={results.headers}
          rows={results.rows}
          mapping={mapping}
          onMappingChange={handleMappingChange}
          requiredFields={requiredFields}
        />
      );
    }
    
    if (status === 'success') {
      return (
        <ResultsDisplay 
          processedCount={results.processedCount}
          errorRows={results.errorRows}
          onDownloadErrors={downloadErrorsCSV}
        />
      );
    }
    
    if (status === 'error') {
      return <ImportError />;
    }
    
    return null;
  };

  const getCardTitle = () => {
    switch (status) {
      case 'idle': return "Selecione uma planilha para importar";
      case 'reading': return "Lendo planilha...";
      case 'mapping': return "Mapeamento de colunas";
      case 'processing': return "Processando dados...";
      case 'success': return "Importação concluída";
      case 'error': return "Erro na importação";
      default: return "";
    }
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Importação de Dados Conexa</h1>
        <p className="text-muted-foreground mb-6">
          Importe dados de clientes, contratos e serviços diretamente de uma planilha do Conexa.
        </p>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getCardTitle()}</CardTitle>
            {status === 'mapping' && (
              <CardDescription>
                Relacione as colunas da sua planilha com os campos do sistema. Campos com * são obrigatórios.
              </CardDescription>
            )}
            {file && status !== 'idle' && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {file.name}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {getCardContent()}
          </CardContent>
          <CardFooter>
            <ImportActions 
              status={status}
              mapping={mapping}
              requiredFields={requiredFields}
              onCancel={handleCancel}
              onImport={handleImport}
              onTryAgain={handleTryAgain}
            />
          </CardFooter>
        </Card>
        
        <ImportTips />
      </div>
    </div>
  );
}
