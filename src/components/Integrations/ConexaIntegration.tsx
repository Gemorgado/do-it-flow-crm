
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConexaStatusDisplay } from './Conexa/ConexaStatusDisplay';
import { ConexaSyncStats } from './Conexa/ConexaSyncStats';
import { ConexaSyncButton } from './Conexa/ConexaSyncButton';
import { triggerManualSync } from '@/jobs/conexaSyncJob';

// This would come from your API in a real implementation
const mockIntegrationStatus = {
  lastSync: "2025-04-30T10:15:00Z",
  nextSync: "2025-04-30T10:30:00Z",
  status: "connected", // 'connected', 'disconnected', 'error'
  syncCount: {
    customers: 152,
    contracts: 87,
    services: 12
  }
};

export function ConexaIntegration() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(mockIntegrationStatus);
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your API
      const result = await triggerManualSync();
      
      if (result) {
        // Update status with new values from the sync result
        setStatus(result);
      } else {
        // Fallback if no result is returned
        setStatus({
          ...status,
          lastSync: new Date().toISOString(),
          nextSync: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        });
      }
      
      toast({
        title: "Sincronização concluída",
        description: "Os dados do Conexa foram sincronizados com sucesso.",
      });
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Conexa. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Integração Conexa ERP</CardTitle>
          <Badge 
            variant={status.status === "connected" ? "outline" : "destructive"}
            className={status.status === "connected" ? "bg-green-100 text-green-800 border-green-200" : ""}
          >
            {status.status === "connected" ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ConexaStatusDisplay 
            lastSync={status.lastSync} 
            nextSync={status.nextSync} 
            formatDate={formatDate} 
          />
          <ConexaSyncStats syncCount={status.syncCount} />
        </div>
      </CardContent>
      <CardFooter>
        <ConexaSyncButton isLoading={isLoading} onSync={handleManualSync} />
      </CardFooter>
    </Card>
  );
}
