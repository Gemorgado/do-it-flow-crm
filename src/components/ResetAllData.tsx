
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { resetAllDemoData } from "@/utils/resetAllDemoData";
import { resetMetricDemo } from "@/utils/resetMetricDemo";
import { resetOccupancyTrend } from "@/utils/resetOccupancyTrend";
import { toast } from "@/hooks/use-toast";

export function ResetAllData() {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    try {
      if (window.confirm("Tem certeza que deseja zerar TODOS os dados fictícios da plataforma? Esta ação não pode ser desfeita.")) {
        setIsResetting(true);
        
        // Reset all demo data
        await resetAllDemoData();
        
        // Reset metric data specifically (garantir limpeza dupla)
        resetMetricDemo();
        
        // Reset occupancy trend data
        resetOccupancyTrend();
        
        toast({
          title: "Dados limpos com sucesso",
          description: "A página será recarregada para aplicar as alterações."
        });

        // Reload page to ensure everything is reset
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      toast({
        title: "Erro ao limpar dados",
        description: "Ocorreu um erro ao limpar os dados de demonstração.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleReset}
      disabled={isResetting}
      title="Limpar todos os dados de demonstração"
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isResetting ? "Zerando..." : "Zerar dados"}
    </Button>
  );
}
