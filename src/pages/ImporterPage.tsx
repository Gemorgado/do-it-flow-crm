
import React from 'react';
import { useImporter } from '@/hooks/useImporter';
import { UploadStep } from './Importer/UploadStep';
import { MappingStep } from './Importer/MappingStep';
import { PreviewStep } from './Importer/PreviewStep';
import { ErrorStep } from './Importer/ErrorStep';
import { SuccessStep } from './Importer/SuccessStep';
import { HowItWorks } from '@/components/Importer/HowItWorks';

export default function ImporterPage() {
  const {
    step,
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
  } = useImporter();

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
            onContinue={() => step = 'preview'}
            onBack={handleReset}
          />
        )}
        
        {step === 'preview' && (
          <PreviewStep
            mapping={mapping}
            previewRows={rows.slice(0, 5)}
            onBack={() => step = 'mapping'}
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
      
      <HowItWorks />
    </div>
  );
}
