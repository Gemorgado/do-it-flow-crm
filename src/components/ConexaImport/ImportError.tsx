
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

export function ImportError() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro na importação</AlertTitle>
      <AlertDescription>
        Ocorreu um erro ao processar o arquivo. Tente novamente ou contate o suporte.
      </AlertDescription>
    </Alert>
  );
}
