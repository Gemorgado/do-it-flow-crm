
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Database, RefreshCw, Check, Loader } from "lucide-react";

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
    
    // This would be a real API call in production
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status with new values
      setStatus({
        ...status,
        lastSync: new Date().toISOString(),
        nextSync: new Date(Date.now() + 15 * 60 * 1000).toISOString() // +15 min
      });
      
      toast({
        title: "Sincronização concluída",
        description: "Os dados do Conexa foram sincronizados com sucesso.",
      });
    } catch (error) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Última sincronização</p>
                <p className="font-medium">{formatDate(status.lastSync)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Próxima sincronização</p>
                <p className="font-medium">{formatDate(status.nextSync)}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium mb-2">Dados sincronizados</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Clientes</span>
                <span className="font-medium">{status.syncCount.customers}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Contratos</span>
                <span className="font-medium">{status.syncCount.contracts}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Serviços</span>
                <span className="font-medium">{status.syncCount.services}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleManualSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Sincronizar Agora
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
