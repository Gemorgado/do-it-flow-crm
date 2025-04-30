
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { InternalField } from '@/integrations/importer/types';

interface MissingFieldsWarningProps {
  missingFields: InternalField[];
  fieldLabels: Record<InternalField, string>;
}

export function MissingFieldsWarning({ missingFields, fieldLabels }: MissingFieldsWarningProps) {
  if (missingFields.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <p>Os seguintes campos são obrigatórios:</p>
        <ul className="list-disc list-inside mt-1">
          {missingFields.map(field => (
            <li key={field}>{fieldLabels[field].replace(' *', '')}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
