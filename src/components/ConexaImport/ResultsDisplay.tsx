
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ResultsDisplayProps {
  processedCount: {
    customers: number;
    contracts: number;
    services: number;
    roomOccupations: number;
  };
  errorRows: Array<{
    index: number;
    row: Record<string, any>;
    error: string;
  }>;
  onDownloadErrors: () => void;
}

export function ResultsDisplay({ 
  processedCount, 
  errorRows, 
  onDownloadErrors 
}: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{processedCount.customers}</div>
          <p className="text-sm text-muted-foreground">Clientes processados</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{processedCount.contracts}</div>
          <p className="text-sm text-muted-foreground">Contratos criados</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{processedCount.services}</div>
          <p className="text-sm text-muted-foreground">Serviços mapeados</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{processedCount.roomOccupations}</div>
          <p className="text-sm text-muted-foreground">Salas ocupadas</p>
        </div>
      </div>

      {errorRows.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erros na importação</AlertTitle>
          <AlertDescription>
            {errorRows.length} linhas não puderam ser processadas.
            <Button 
              variant="link" 
              onClick={onDownloadErrors} 
              className="p-0 h-auto font-semibold"
            >
              Baixar log de erros (CSV)
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
