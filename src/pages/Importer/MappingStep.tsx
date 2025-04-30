
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InternalField } from '@/integrations/importer/types';
import { TemplateControls } from '@/components/Importer/Mapping/TemplateControls';
import { MappingTable } from '@/components/Importer/Mapping/MappingTable';
import { MissingFieldsWarning } from '@/components/Importer/Mapping/MissingFieldsWarning';
import { useMappingStep, fieldLabels, requiredFields } from '@/hooks/useMappingStep';

interface MappingStepProps {
  headers: string[];
  previewRows?: Record<string, any>[];
  initialMapping?: Record<string, InternalField>;
  onMappingChange: (mapping: Record<string, InternalField>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function MappingStep({
  headers,
  previewRows = [],
  initialMapping = {},
  onMappingChange,
  onContinue,
  onBack,
}: MappingStepProps) {
  const {
    mapping,
    templates,
    selectedTemplate,
    missingFields,
    canContinue,
    handleMappingChange,
    handleSaveTemplate,
    handleLoadTemplate,
  } = useMappingStep(headers, initialMapping, onMappingChange);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Mapeamento de Colunas</span>
            
            <TemplateControls 
              templates={templates}
              selectedTemplate={selectedTemplate}
              onLoadTemplate={handleLoadTemplate}
              onSaveTemplate={handleSaveTemplate}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MappingTable 
            headers={headers}
            previewRows={previewRows}
            mapping={mapping}
            onMappingChange={handleMappingChange}
            fieldLabels={fieldLabels}
            requiredFields={requiredFields}
          />
          
          <MissingFieldsWarning 
            missingFields={missingFields} 
            fieldLabels={fieldLabels} 
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onContinue} disabled={!canContinue}>
            Continuar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
