
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PixelStatus() {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Status da Integração</h4>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          <Check className="h-3.5 w-3.5 mr-1" /> Conectado
        </Badge>
        <span className="text-sm text-gray-500">Última verificação: 29/04/2025, 14:23</span>
      </div>
    </div>
  );
}
