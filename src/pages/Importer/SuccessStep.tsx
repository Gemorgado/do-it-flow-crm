
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft, BarChart } from 'lucide-react';
import { ConexaSnapshot } from '@/integrations/conexa/types';

interface SuccessStepProps {
  snapshot: ConexaSnapshot;
  onReset: () => void;
  onViewData: () => void;
}

export function SuccessStep({ snapshot, onReset, onViewData }: SuccessStepProps) {
  const itemCounts = {
    customers: snapshot.customers.length,
    contracts: snapshot.contracts.length,
    services: snapshot.services.length,
    roomOccupations: snapshot.roomOccupations.length
  };
  
  return (
    <div className="space-y-4">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Importação Concluída com Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md border">
              <p className="text-sm text-muted-foreground">Clientes</p>
              <p className="text-3xl font-bold">{itemCounts.customers}</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <p className="text-sm text-muted-foreground">Contratos</p>
              <p className="text-3xl font-bold">{itemCounts.contracts}</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <p className="text-sm text-muted-foreground">Serviços</p>
              <p className="text-3xl font-bold">{itemCounts.services}</p>
            </div>
            <div className="bg-white p-4 rounded-md border">
              <p className="text-sm text-muted-foreground">Ocupações</p>
              <p className="text-3xl font-bold">{itemCounts.roomOccupations}</p>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm">
            <p>Todos os dados foram importados com sucesso e estão disponíveis no sistema.</p>
            <p className="mt-1">Os dados foram sincronizados com o Conexa em {new Date(snapshot.syncedAt).toLocaleString()}.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nova Importação
          </Button>
          <Button onClick={onViewData} className="gap-2">
            <BarChart className="h-4 w-4" />
            Visualizar Dados
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
