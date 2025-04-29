
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackCustomMetaPixelEvent } from "@/utils/metaPixelUtils";

interface PixelIdConfigurationProps {
  pixelId: string;
  setPixelId: (id: string) => void;
}

export function PixelIdConfiguration({ pixelId, setPixelId }: PixelIdConfigurationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPixelId, setNewPixelId] = useState(pixelId);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência.",
      variant: "default"
    });
  };

  return (
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
  );
}
