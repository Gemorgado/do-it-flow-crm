
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SERVICE_OPTIONS } from '@/constants/serviceOptions';
import { InternalField } from '@/integrations/importer/types';

interface PreviewStepProps {
  mapping: Record<string, InternalField>;
  previewRows: Record<string, any>[];
  onBack: () => void;
  onImport: () => void;
  isLoading?: boolean;
}

// Get service label from value
function getServiceLabel(value: string): string {
  const option = SERVICE_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
}

export function PreviewStep({
  mapping,
  previewRows,
  onBack,
  onImport,
  isLoading = false,
}: PreviewStepProps) {
  // Create a reverse mapping (InternalField -> header)
  const reverseMapping: Record<string, string> = {};
  
  Object.entries(mapping).forEach(([header, field]) => {
    reverseMapping[field] = header;
  });
  
  // Ensure we only show columns that have been mapped
  const mappedFields = Object.values(mapping);

  // Get the mapped preview data
  const mappedPreviewRows = previewRows.map(row => {
    const mappedRow: Record<string, any> = {};
    
    mappedFields.forEach(field => {
      const header = reverseMapping[field];
      if (header) {
        mappedRow[field] = row[header];
        
        // Format special cases
        if (field === 'plan') {
          mappedRow[`${field}Label`] = getServiceLabel(mappedRow[field]);
        }
      }
    });
    
    return mappedRow;
  });
  
  // Take up to 5 rows for preview
  const displayRows = mappedPreviewRows.slice(0, 5);
  const totalRows = previewRows.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pré-visualização dos Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {mappedFields.map(field => (
                    <TableHead key={field}>{field}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRows.map((row, index) => (
                  <TableRow key={index}>
                    {mappedFields.map(field => (
                      <TableCell key={field}>
                        {field === 'plan' && row[field] 
                          ? row[`${field}Label`] || row[field] 
                          : (row[field] !== undefined ? String(row[field]) : '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {displayRows.length} de {totalRows} registros.
            {totalRows > 5 && " Apenas as primeiras 5 linhas são exibidas na pré-visualização."}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
            <p>Ao importar, os dados serão verificados e os registros válidos serão adicionados ao sistema.</p>
            <p className="mt-1">Em caso de erros, você poderá baixar um relatório detalhado.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={isLoading}>
            Voltar
          </Button>
          <Button onClick={onImport} disabled={isLoading}>
            {isLoading ? "Importando..." : "Importar Dados"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
