
import React from 'react';
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
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
      <p className="font-medium">Campos obrigatórios não mapeados:</p>
      <ul className="list-disc list-inside mt-1">
        {missingFields.map(field => (
          <li key={field}>{fieldLabels[field]}</li>
        ))}
      </ul>
    </div>
  );
}
