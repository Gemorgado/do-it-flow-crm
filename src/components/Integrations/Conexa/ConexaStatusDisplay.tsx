
import React from 'react';
import { RefreshCw } from "lucide-react";

interface ConexaStatusDisplayProps {
  lastSync: string;
  nextSync: string;
  formatDate: (dateString: string) => string;
}

export function ConexaStatusDisplay({ lastSync, nextSync, formatDate }: ConexaStatusDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        <div>
          <p className="text-sm text-gray-500">Última sincronização</p>
          <p className="font-medium">{formatDate(lastSync)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        <div>
          <p className="text-sm text-gray-500">Próxima sincronização</p>
          <p className="font-medium">{formatDate(nextSync)}</p>
        </div>
      </div>
    </div>
  );
}
