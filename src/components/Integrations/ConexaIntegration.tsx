
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload } from "lucide-react";
import { ConexaStatusDisplay } from "./Conexa/ConexaStatusDisplay";
import { ConexaSyncButton } from "./Conexa/ConexaSyncButton";
import { ConexaSyncStats } from "./Conexa/ConexaSyncStats";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export function ConexaIntegration() {
  const navigate = useNavigate();
  
  // Mock data for demonstration - in a real app, these would come from hooks
  const lastSync = new Date().toISOString();
  const nextSync = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const syncCount = { customers: 42, contracts: 36, services: 8 };
  const isPending = false;
  const doSync = async () => {
    // Implementation would go here
    console.log("Syncing...");
  };
  
  const formatDateDisplay = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Integração com Conexa</span>
          <ConexaStatusDisplay 
            lastSync={lastSync} 
            nextSync={nextSync} 
            formatDate={formatDateDisplay} 
          />
        </CardTitle>
        <CardDescription>
          Sincronize clientes, contratos e histórico de uso de salas a partir do Conexa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConexaSyncStats syncCount={syncCount} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sincronização Manual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Execute manualmente a sincronização quando necessário.
              </p>
            </CardContent>
            <CardFooter>
              <ConexaSyncButton isLoading={isPending} onSync={doSync} />
            </CardFooter>
          </Card>
          
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Importação de Planilha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Importe dados de planilhas do Conexa ou outros sistemas.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/importador')}
                className="w-full flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importar Planilha
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
