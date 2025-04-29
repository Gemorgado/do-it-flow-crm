
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CalendarCheck, Plus } from "lucide-react";

export function AutomationsIntegrationsCard() {
  return (
    <Tabs defaultValue="automations" className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium mb-1">Automações e Integrações</h3>
        <p className="text-sm text-gray-500">Configure fluxos automáticos para otimizar seu processo de vendas</p>
        <TabsList className="mt-3">
          <TabsTrigger value="automations">Automações</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>
      </div>
      
      <div className="p-4">
        <TabsContent value="automations" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 bg-doIt-light">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Boas-vindas Lead</h4>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">Envio automático de mensagem de boas-vindas para novos leads.</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">WhatsApp</Badge>
                <Badge variant="outline">E-mail</Badge>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Follow-up Automático</h4>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">Lembretes de follow-up para leads sem resposta há mais de 3 dias.</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Notificação</Badge>
                <Badge variant="outline">WhatsApp</Badge>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Alerta de Renovação</h4>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Desativado</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">Alertas para contratos próximos do vencimento (30 dias antes).</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">E-mail</Badge>
                <Badge variant="outline">Tarefa</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Nova Automação
          </Button>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 bg-doIt-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <h4 className="font-medium">WhatsApp Business</h4>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-3">Conectado</Badge>
              <p className="text-sm text-gray-600">Envie e receba mensagens diretamente pelo CRM.</p>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <h4 className="font-medium">Google Tag Manager</h4>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Pendente</Badge>
              <p className="text-sm text-gray-600">Rastreie a origem dos leads e campanhas.</p>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <h4 className="font-medium">Assinatura Digital</h4>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Pendente</Badge>
              <p className="text-sm text-gray-600">Integre com DocuSign para contratos digitais.</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Nova Integração
          </Button>
        </TabsContent>
      </div>
    </Tabs>
  );
}
