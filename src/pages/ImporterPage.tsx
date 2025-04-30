
import React from 'react';
import { ImporterHeader } from '@/components/Importer/ImporterHeader';
import { HowItWorks } from '@/components/Importer/HowItWorks';
import { ImporterStepper } from '@/components/Importer/ImporterStepper';
import { useImporter } from '@/hooks/useImporter';
import { InternalField } from '@/integrations/importer/types';

export default function ImporterPage() {
  const importer = useImporter();
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <ImporterHeader />
      
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <ImporterStepper
            step={importer.step}
            headers={importer.headers}
            rows={importer.rows}
            mapping={importer.mapping}
            errors={importer.errors}
            snapshot={importer.snapshot}
            isLoading={importer.isLoading}
            handleFileSelect={importer.handleFileSelect}
            handleMappingChange={importer.handleMappingChange}
            handleImport={importer.handleImport}
            handleDownloadErrors={importer.handleDownloadErrors}
            handleReset={importer.handleReset}
            handleViewData={importer.handleViewData}
            handleNavigateToStep={importer.handleNavigateToStep}
          />
        </div>
        
        <div className="md:col-span-2">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
