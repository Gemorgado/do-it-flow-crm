
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { trackCustomMetaPixelEvent } from "@/utils/metaPixelUtils";

export function PixelActions() {
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
  );
}
