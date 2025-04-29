
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Facebook, Check, Copy } from "lucide-react";
import { trackCustomMetaPixelEvent } from "@/utils/metaPixelUtils";

export function MetaPixelIntegration() {
  const [pixelId, setPixelId] = useState('123456789012345');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newPixelId, setNewPixelId] = useState(pixelId);
  
  const events = [
    { name: 'PageView', description: 'Visualização de páginas', tracked: 256 },
    { name: 'Lead', description: 'Novos leads capturados', tracked: 48 },
    { name: 'new_lead_button_click', description: 'Clique em Novo Lead', tracked: 76, custom: true },
    { name: 'CompleteRegistration', description: 'Registros completos', tracked: 32 }
  ];
  
  const handleSave = () => {
    const validIdRegex = /^\d{15}$/;
    if (!validIdRegex.test(newPixelId)) {
      toast({
        title: "ID Inválido",
        description: "O ID do Meta Pixel deve conter 15 dígitos.",
        variant: "destructive"
      });
      return;
    }

    setPixelId(newPixelId);
    setIsEditing(false);
    
    toast({
      title: "Configurações salvas",
      description: "O ID do Meta Pixel foi atualizado com sucesso.",
      variant: "default"
    });

    // Track configuration update event
    trackCustomMetaPixelEvent("pixel_config_update", {
      previous_id: pixelId,
      new_id: newPixelId,
      timestamp: new Date().toISOString()
    });
  };
  
  const handleTogglePixel = (checked: boolean) => {
    setIsEnabled(checked);
    
    toast({
      title: checked ? "Pixel Ativado" : "Pixel Desativado",
      description: checked 
        ? "O Meta Pixel está agora rastreando eventos no site." 
        : "O Meta Pixel foi desativado e não rastreará eventos.",
      variant: "default"
    });
    
    // Track toggle event
    trackCustomMetaPixelEvent("pixel_toggle", {
      status: checked ? "enabled" : "disabled",
      timestamp: new Date().toISOString()
    });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência.",
      variant: "default"
    });
  };
  
  const testEvent = () => {
    const success = trackCustomMetaPixelEvent("test_event", { 
      source: "integration_page",
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: success ? "Evento enviado" : "Falha ao enviar evento",
      description: success 
        ? "O evento de teste foi enviado com sucesso para o Meta Pixel." 
        : "Não foi possível enviar o evento. Verifique se o Meta Pixel está configurado corretamente.",
      variant: success ? "default" : "destructive"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white flex-shrink-0">
          <Facebook className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">Meta Pixel</h3>
          <p className="text-sm text-gray-500 mt-1 mb-3">
            Rastreie conversões, otimize anúncios e crie públicos personalizados com base em ações dos usuários.
          </p>
          
          <div className="flex items-center gap-2">
            <Switch 
              checked={isEnabled} 
              onCheckedChange={handleTogglePixel} 
              id="pixel-status"
            />
            <Label htmlFor="pixel-status">
              {isEnabled ? 'Ativo' : 'Desativado'}
            </Label>
          </div>
        </div>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">ID do Meta Pixel</h4>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={newPixelId}
                  onChange={(e) => setNewPixelId(e.target.value)}
                  placeholder="Digite o ID do Pixel (15 dígitos)"
                  className="flex-1"
                />
                <Button onClick={handleSave} size="sm">Salvar</Button>
                <Button onClick={() => {
                  setIsEditing(false);
                  setNewPixelId(pixelId);
                }} variant="outline" size="sm">Cancelar</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{pixelId}</code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard(pixelId)}
                    className="h-6 w-6"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Status da Integração</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <Check className="h-3.5 w-3.5 mr-1" /> Conectado
              </Badge>
              <span className="text-sm text-gray-500">Última verificação: 29/04/2025, 14:23</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h4 className="text-sm font-medium mb-3">Eventos Rastreados</h4>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.name}</span>
                  {event.custom && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-xs">
                      Personalizado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{event.tracked}</span>
                <p className="text-xs text-gray-500">Registros</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" size="sm" onClick={testEvent}>
          Enviar Evento de Teste
        </Button>
        <Button 
          size="sm" 
          variant="link" 
          className="text-gray-500"
          onClick={() => window.open('https://developers.facebook.com/docs/meta-pixel', '_blank')}
        >
          Documentação do Meta Pixel
        </Button>
      </div>
    </div>
  );
}
