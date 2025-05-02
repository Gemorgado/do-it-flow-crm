
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MetaPixelIntegration } from '@/components/Integrations/MetaPixelIntegration';
import { ConexaIntegration } from '@/components/Integrations/ConexaIntegration';
import { WebhookCard } from '@/components/Integrations/WebhookCard';
import { useIntegrations } from '@/hooks/useIntegrations';
import { IntegrationCard } from '@/components/Integrations/IntegrationCard';
import { EmptyState } from '@/components/Integrations/EmptyState';
import { Integration } from '@/types/integration';

export default function Integrations() {
  const integrations = useIntegrations();
  
  const active = integrations.filter(i => i.status === 'connected');
  const available = integrations.filter(i => i.status === 'disconnected');
  
  const pixelIntegrations = integrations.filter(i => i.category === 'pixel');
  const erpIntegrations = integrations.filter(i => i.category === 'erp');
  const webhookIntegrations = integrations.filter(i => i.category === 'webhook');
  
  const hasActivePixel = pixelIntegrations.some(i => i.status === 'connected');
  const hasActiveErp = erpIntegrations.some(i => i.status === 'connected');
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
          <p className="text-gray-500">Conecte o Do It Flow com outras plataformas e serviços</p>
        </div>
        <Button 
          size="sm" 
          className="bg-doIt-primary hover:bg-doIt-dark"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Integração
        </Button>
      </div>
      
      <Tabs defaultValue="ativas" className="mt-6">
        <TabsList>
          <TabsTrigger value="ativas">Ativas</TabsTrigger>
          <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
          <TabsTrigger value="pixels">Pixel de Rastreamento</TabsTrigger>
          <TabsTrigger value="erp">Sistemas ERP</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativas" className="mt-4">
          {active.length === 0 && <EmptyState msg="Nenhuma integração conectada" />}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {active.map(integration => (
              <IntegrationCard key={integration.id} data={integration} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="disponiveis" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {available.map(integration => (
              <IntegrationCard key={integration.id} data={integration} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pixels" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Configurações do Meta Pixel</h3>
            {hasActivePixel ? (
              <MetaPixelIntegration />
            ) : (
              <div className="py-6">
                <EmptyState msg="Nenhuma integração de Pixel conectada" />
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => {
                      const metaPixel = pixelIntegrations.find(i => i.id === 'meta_pixel');
                      if (metaPixel) {
                        window.location.href = "#disponiveis";
                      }
                    }}
                  >
                    Conectar Pixel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="erp" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Conexa ERP</h3>
            {hasActiveErp ? (
              <ConexaIntegration />
            ) : (
              <div className="py-6">
                <EmptyState msg="Nenhuma integração ERP conectada" />
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => {
                      const conexa = erpIntegrations.find(i => i.id === 'conexa_erp');
                      if (conexa) {
                        window.location.href = "#disponiveis";
                      }
                    }}
                  >
                    Conectar Conexa ERP
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="mt-4">
          <WebhookCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
