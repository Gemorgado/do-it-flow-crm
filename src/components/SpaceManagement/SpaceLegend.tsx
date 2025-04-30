
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

export function SpaceLegend() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700">
          <HelpCircle className="h-4 w-4 mr-1" />
          Legenda
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <h3 className="font-medium mb-2">Status dos Espaços</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-100 border border-green-400 rounded mr-2"></span>
            <span className="text-sm">Ocupado (vinculado a cliente)</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded mr-2"></span>
            <span className="text-sm">Reserva futura</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></span>
            <span className="text-sm">Disponível</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></span>
            <span className="text-sm">Indisponível</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
