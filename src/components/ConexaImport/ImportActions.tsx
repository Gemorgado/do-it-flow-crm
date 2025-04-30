
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader, X, Check } from 'lucide-react';
import type { ColumnMapping } from '@/hooks/useConexaMapper';

interface ImportActionsProps {
  status: 'idle' | 'reading' | 'mapping' | 'processing' | 'success' | 'error';
  mapping: ColumnMapping;
  requiredFields: string[];
  onCancel: () => void;
  onImport: () => void;
  onTryAgain: () => void;
}

export function ImportActions({
  status,
  mapping,
  requiredFields,
  onCancel,
  onImport,
  onTryAgain
}: ImportActionsProps) {
  return (
    <div className="flex justify-between border-t pt-6">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={status === 'processing'}
      >
        {status === 'success' ? "Voltar para Integrações" : "Cancelar"}
      </Button>
      
      {status === 'mapping' && (
        <Button 
          onClick={onImport}
          disabled={requiredFields.some(field => !mapping[field as keyof ColumnMapping])}
        >
          Importar dados
        </Button>
      )}
      
      {status === 'processing' && (
        <Button disabled>
          <Loader className="mr-2 h-4 w-4 animate-spin" /> 
          Processando...
        </Button>
      )}
      
      {status === 'success' && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onTryAgain}>
            <X className="mr-2 h-4 w-4" /> 
            Limpar e importar outra
          </Button>
          <Button onClick={onCancel}>
            <Check className="mr-2 h-4 w-4" /> 
            Concluir
          </Button>
        </div>
      )}
      
      {status === 'error' && (
        <Button onClick={onTryAgain}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
