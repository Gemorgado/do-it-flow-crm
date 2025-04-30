
import React from 'react';

interface SyncCount {
  customers: number;
  contracts: number;
  services: number;
}

interface ConexaSyncStatsProps {
  syncCount: SyncCount;
}

export function ConexaSyncStats({ syncCount }: ConexaSyncStatsProps) {
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <p className="text-sm font-medium mb-2">Dados sincronizados</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Clientes</span>
          <span className="font-medium">{syncCount.customers}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Contratos</span>
          <span className="font-medium">{syncCount.contracts}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Serviços</span>
          <span className="font-medium">{syncCount.services}</span>
        </div>
      </div>
    </div>
  );
}
