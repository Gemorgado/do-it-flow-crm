
import { Facebook } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { trackCustomMetaPixelEvent } from "@/utils/metaPixelUtils";

interface PixelHeaderProps {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
}

export function PixelHeader({ isEnabled, setIsEnabled }: PixelHeaderProps) {
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

  return (
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
  );
}
