
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Calendar, Facebook, Code, FileCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MetaPixelIntegration } from '@/components/Integrations/MetaPixelIntegration';

export default function Integrations() {
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
      
      <Tabs defaultValue="active" className="mt-6">
        <TabsList>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="pixels">Pixel de Rastreamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-5 bg-doIt-light">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-lg">WhatsApp Business</h4>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-3">Conectado</Badge>
              <p className="text-sm text-gray-600 mb-4">Envie e receba mensagens diretamente pelo CRM.</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Conectado em: 15/04/2025</span>
                <Button variant="ghost" size="sm" className="text-xs">Configurar</Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-5 bg-doIt-light">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white">
                  <Facebook className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-lg">Meta Pixel</h4>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-3">Conectado</Badge>
              <p className="text-sm text-gray-600 mb-4">Acompanhe conversões e eventos do seu site.</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Conectado em: 20/04/2025</span>
                <Button variant="ghost" size="sm" className="text-xs">Configurar</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white">
                  <Code className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-lg">Google Tag Manager</h4>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Disponível</Badge>
              <p className="text-sm text-gray-600 mb-4">Rastreie a origem dos leads e campanhas.</p>
              <Button size="sm" className="w-full">Conectar</Button>
            </div>

            <div className="border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-md flex items-center justify-center text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-lg">Assinatura Digital</h4>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Disponível</Badge>
              <p className="text-sm text-gray-600 mb-4">Integre com DocuSign para contratos digitais.</p>
              <Button size="sm" className="w-full">Conectar</Button>
            </div>

            <div className="border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center text-white">
                  <FileCode className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-lg">Zapier</h4>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Disponível</Badge>
              <p className="text-sm text-gray-600 mb-4">Integre com milhares de aplicativos.</p>
              <Button size="sm" className="w-full">Conectar</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pixels" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Configurações do Meta Pixel</h3>
            <MetaPixelIntegration />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
