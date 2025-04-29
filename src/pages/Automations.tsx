
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function Automations() {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
          <p className="text-gray-500">Configure fluxos automáticos para otimizar seu processo de vendas</p>
        </div>
        <Button 
          size="sm" 
          className="bg-doIt-primary hover:bg-doIt-dark"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Automação
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="border rounded-lg p-5 bg-doIt-light">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-lg">Boas-vindas Lead</h4>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">Envio automático de mensagem de boas-vindas para novos leads.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">WhatsApp</Badge>
            <Badge variant="outline">E-mail</Badge>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Criada em: 15/04/2025</span>
            <span>Execuções: 256</span>
          </div>
        </div>

        <div className="border rounded-lg p-5">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-lg">Follow-up Automático</h4>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">Lembretes de follow-up para leads sem resposta há mais de 3 dias.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">Notificação</Badge>
            <Badge variant="outline">WhatsApp</Badge>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Criada em: 10/03/2025</span>
            <span>Execuções: 178</span>
          </div>
        </div>

        <div className="border rounded-lg p-5">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-lg">Alerta de Renovação</h4>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Desativado</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">Alertas para contratos próximos do vencimento (30 dias antes).</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">E-mail</Badge>
            <Badge variant="outline">Tarefa</Badge>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Criada em: 25/02/2025</span>
            <span>Execuções: 42</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-5 border-dashed flex flex-col items-center justify-center text-center h-[200px]">
          <Plus className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500 font-medium">Adicionar Nova Automação</p>
          <p className="text-gray-400 text-sm mt-1">Crie fluxos automáticos personalizados</p>
        </div>
      </div>
    </div>
  );
}
