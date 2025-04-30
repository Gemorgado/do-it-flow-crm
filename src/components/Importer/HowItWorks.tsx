
import React from 'react';

export function HowItWorks() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Como funciona</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border rounded-md p-4 bg-muted/20">
          <div className="font-medium">1. Envie sua planilha</div>
          <p className="text-sm text-muted-foreground mt-1">
            Carregue uma planilha no formato Excel ou CSV com seus dados.
          </p>
        </div>
        <div className="border rounded-md p-4 bg-muted/20">
          <div className="font-medium">2. Mapeie as colunas</div>
          <p className="text-sm text-muted-foreground mt-1">
            Associe as colunas da sua planilha aos campos do sistema ou use um template salvo.
          </p>
        </div>
        <div className="border rounded-md p-4 bg-muted/20">
          <div className="font-medium">3. Importe os dados</div>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize e confirme a importação para adicionar os dados ao sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
