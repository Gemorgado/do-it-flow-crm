
import React from 'react';

export function ImportTips() {
  return (
    <div className="text-sm text-muted-foreground">
      <p className="mb-2">Dicas para uma importação bem-sucedida:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Verifique se a primeira linha da planilha contém os cabeçalhos das colunas</li>
        <li>Os campos Nome, CNPJ/CPF e Tipo de Serviço são obrigatórios</li>
        <li>CNPJs e CPFs serão formatados automaticamente, não se preocupe com a formatação</li>
        <li>Para novos clientes, todos os contratos serão criados com data de início atual</li>
      </ul>
    </div>
  );
}
