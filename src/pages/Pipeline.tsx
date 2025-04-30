
import { PipelineHeader } from "@/components/Pipeline/PipelineHeader";
import { PipelineSearch } from "@/components/Pipeline/PipelineSearch";
import { PipelineBoard } from "@/components/Pipeline/PipelineBoard";
import { leads, pipelineStages } from "@/data/leadsData";
import { usePipelineData } from "@/hooks/usePipelineData";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { resetDemoData } from "@/utils/resetDemoData";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/modules/auth/AuthProvider";

export default function Pipeline() {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  
  const { 
    leadsByStage,
    leadsNeedingAttention,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleSearchLeads,
    handleFilterByUser,
    updateLeadStage
  } = usePipelineData(leads, pipelineStages);

  const handleResetPipeline = async () => {
    if (confirm('Tem certeza que deseja zerar todos os dados do Pipeline? Esta ação não pode ser desfeita.')) {
      setIsResetting(true);
      try {
        await resetDemoData();
        toast({
          title: "Pipeline zerado",
          description: "Todos os dados do Pipeline foram removidos com sucesso",
        });
        // Forçar refresh da página para garantir que todos os componentes sejam recarregados
        window.location.reload();
      } catch (error) {
        console.error("Erro ao zerar pipeline:", error);
        toast({
          title: "Erro ao zerar pipeline",
          description: "Não foi possível zerar os dados. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <PipelineHeader leadsNeedingAttention={leadsNeedingAttention} />
        
        {user?.viewAllProposals && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleResetPipeline}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isResetting ? "Zerando..." : "Zerar Pipeline"}
          </Button>
        )}
      </div>
      
      <PipelineSearch 
        onSearch={handleSearchLeads}
        onFilterByUser={handleFilterByUser}
      />

      <PipelineBoard
        pipelineStages={pipelineStages}
        leadsByStage={leadsByStage}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onStageUpdate={updateLeadStage}
      />
    </div>
  );
}
