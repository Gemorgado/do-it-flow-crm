
import React from "react";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { FileChartColumnIncreasing, Trash2 } from "lucide-react";
import { BarChart } from "@/components/ui/chart";
import { OccupancyTrendItem } from "@/hooks/useOccupancyTrend";
import { toast } from "@/hooks/use-toast";

interface OccupancyChartProps {
  occupancyOverTimeData: OccupancyTrendItem[];
  hasData: boolean;
  onResetTrend: () => void;
}

export function OccupancyChart({ 
  occupancyOverTimeData, 
  hasData, 
  onResetTrend 
}: OccupancyChartProps) {
  // Fixed chart configuration with proper colors and styling
  const barChartConfig = {
    Salas: { color: "#4f46e5" },      // Fixed color for rooms
    Estações: { color: "#06b6d4" }     // Fixed color for workstations
  };

  const handleResetClick = () => {
    if (window.confirm("Deseja realmente zerar o histórico da taxa de ocupação?")) {
      onResetTrend();
      toast({
        title: "Histórico zerado",
        description: "Os dados de ocupação foram removidos com sucesso."
      });
    }
  };

  return (
    <ChartCard 
      title="Evolução da Taxa de Ocupação" 
      description="Porcentagem de ocupação ao longo dos últimos 6 meses"
      action={
        <div className="flex items-center gap-2">
          <FileChartColumnIncreasing className="h-4 w-4 text-muted-foreground" />
          <Trash2
            className="w-4 h-4 cursor-pointer text-zinc-500 hover:text-zinc-800"
            onClick={handleResetClick}
            aria-label="Zerar histórico da taxa de ocupação"
          />
        </div>
      }
    >
      <div className="p-6">
        {hasData ? (
          <BarChart 
            data={occupancyOverTimeData} 
            config={barChartConfig}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground">Sem dados de ocupação disponíveis</p>
            <p className="text-sm text-muted-foreground mt-1">
              Os dados serão exibidos quando houver informações de ocupação.
            </p>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
