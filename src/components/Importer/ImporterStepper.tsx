
import React from 'react';
import { ImportStep, InternalField } from '@/integrations/importer/types';
import { UploadStep } from '@/pages/Importer/UploadStep';
import { MappingStep } from '@/pages/Importer/MappingStep';
import { PreviewStep } from '@/pages/Importer/PreviewStep';
import { ErrorStep } from '@/pages/Importer/ErrorStep';
import { SuccessStep } from '@/pages/Importer/SuccessStep';

interface ImporterStepperProps {
  step: ImportStep;
  headers: string[];
  rows: Record<string, any>[];
  mapping: Record<string, InternalField | ''>;
  errors: any[];
  snapshot: any;
  isLoading: boolean;
  handleFileSelect: (file: File) => void;
  handleMappingChange: (header: string, field: InternalField | '') => void;
  handleImport: () => void;
  handleDownloadErrors: () => void;
  handleReset: () => void;
  handleViewData: () => void;
  handleNavigateToStep: (step: ImportStep) => void;
}

export function ImporterStepper({
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
  handleViewData,
  handleNavigateToStep
}: ImporterStepperProps) {
  return (
    <>
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
          onContinue={() => handleNavigateToStep('preview')}
          onBack={handleReset}
        />
      )}
      
      {step === 'preview' && (
        <PreviewStep
          mapping={mapping}
          previewRows={rows.slice(0, 5)}
          onBack={() => handleNavigateToStep('mapping')}
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
    </>
  );
}
