
import React from 'react';
import { useImporter } from '@/hooks/useImporter';
import { ImporterHeader } from '@/components/Importer/ImporterHeader';
import { ImporterStepper } from '@/components/Importer/ImporterStepper';
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
    handleViewData,
    handleNavigateToStep
  } = useImporter();

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <ImporterHeader />
      
      <div className="mb-8">
        <ImporterStepper 
          step={step}
          headers={headers}
          rows={rows}
          mapping={mapping}
          errors={errors}
          snapshot={snapshot}
          isLoading={isLoading}
          handleFileSelect={handleFileSelect}
          handleMappingChange={handleMappingChange}
          handleImport={handleImport}
          handleDownloadErrors={handleDownloadErrors}
          handleReset={handleReset}
          handleViewData={handleViewData}
          handleNavigateToStep={handleNavigateToStep}
        />
      </div>
      
      <HowItWorks />
    </div>
  );
}
