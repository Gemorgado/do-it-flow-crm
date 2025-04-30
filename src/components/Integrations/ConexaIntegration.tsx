
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConexaStatusDisplay } from './Conexa/ConexaStatusDisplay';
import { ConexaSyncStats } from './Conexa/ConexaSyncStats';
import { ConexaSyncButton } from './Conexa/ConexaSyncButton';
import { triggerManualSync } from '@/jobs/conexaSyncJob';
import { useConexaSnapshot, useApplySnapshot } from '@/hooks/useConexaSnapshot';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { mapContracts } from '@/integrations/conexa/mapper';

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
  const { data: snapshot } = useConexaSnapshot();
  const applyMutation = useApplySnapshot();
  
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

  const handleApplySnapshot = () => {
    // Create a sample snapshot for demonstration
    // In a real implementation, this would come from the sync result
    const rawContracts = Array(status.syncCount.contracts).fill({}).map((_, i) => ({
      id: `contract-${i+1}`,
      customerId: `cust-${Math.floor(Math.random() * status.syncCount.customers) + 1}`,
      serviceId: `serv-${Math.floor(Math.random() * status.syncCount.services) + 1}`,
      status: Math.random() > 0.2 ? 'active' : 'closed', // Using the normalized values directly here
      amount: Math.floor(Math.random() * 10000) + 1000,
      startDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const sampleSnapshot = {
      customers: Array(status.syncCount.customers).fill({}).map((_, i) => ({
        id: `cust-${i+1}`,
        name: `Cliente ${i+1}`,
        docNumber: `${10000000000 + i}`,
        updatedAt: new Date().toISOString()
      })),
      contracts: mapContracts(rawContracts), // Use mapper to ensure type safety
      services: Array(status.syncCount.services).fill({}).map((_, i) => ({
        id: `serv-${i+1}`,
        label: `Serviço ${i+1}`,
        category: ['Escritório', 'Coworking', 'Sala Privativa'][i % 3],
        price: Math.floor(Math.random() * 5000) + 500,
        updatedAt: new Date().toISOString()
      })),
      roomOccupations: Array(30).fill({}).map((_, i) => ({
        roomId: `room-${Math.floor(Math.random() * 10) + 1}`,
        contractId: `contract-${Math.floor(Math.random() * status.syncCount.contracts) + 1}`,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })),
      syncedAt: new Date().toISOString()
    };
    
    applyMutation.mutate(sampleSnapshot, {
      onSuccess: () => {
        toast({
          title: "Snapshot aplicado",
          description: "Os dados foram processados e salvos com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao aplicar snapshot",
          description: "Não foi possível processar os dados. Tente novamente.",
          variant: "destructive",
        });
        console.error("Error applying snapshot:", error);
      }
    });
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
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Último snapshot: {snapshot?.syncedAt ? formatDate(snapshot.syncedAt) : '—'}
            </p>
            <Button
              variant="outline"
              onClick={handleApplySnapshot}
              disabled={applyMutation.isPending}
              className="w-full mb-4"
            >
              {applyMutation.isPending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              Aplicar snapshot
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <ConexaSyncButton isLoading={isLoading} onSync={handleManualSync} />
      </CardFooter>
    </Card>
  );
}
