
import { PipelineHeader } from "@/components/Pipeline/PipelineHeader";
import { PipelineSearch } from "@/components/Pipeline/PipelineSearch";
import { PipelineBoard } from "@/components/Pipeline/PipelineBoard";
import { leads, pipelineStages } from "@/data/leadsData";
import { usePipelineData } from "@/hooks/usePipelineData";
import { useEffect, useState } from "react";
import { Lead, PipelineStage } from "@/types";

export default function Pipeline() {
  // Inicializa com dados vazios e carrega os defaults do localStorage se existirem
  const [initialLeads, setInitialLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>(pipelineStages);
  
  useEffect(() => {
    // Tenta carregar dados do localStorage ou usa fallback para dados de desenvolvimento
    try {
      const storedLeads = localStorage.getItem("leads");
      const storedStages = localStorage.getItem("pipeline_stages");
      
      if (storedLeads) {
        setInitialLeads(JSON.parse(storedLeads));
      } else {
        setInitialLeads(leads || []);
      }
      
      if (storedStages) {
        setStages(JSON.parse(storedStages));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do pipeline:", err);
      // Fallback para dados de desenvolvimento
      setInitialLeads(leads || []);
    }
  }, []);

  const { 
    leadsByStage,
    leadsNeedingAttention,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleSearchLeads,
    handleFilterByUser,
    updateLeadStage
  } = usePipelineData(initialLeads, stages);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <PipelineHeader leadsNeedingAttention={leadsNeedingAttention} />
      </div>
      
      <PipelineSearch 
        onSearch={handleSearchLeads}
        onFilterByUser={handleFilterByUser}
      />

      {initialLeads.length === 0 ? (
        <div className="text-center py-10 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground">Nenhum lead encontrado no pipeline.</p>
          <p className="text-sm text-muted-foreground mt-1">
            O pipeline foi resetado ou ainda não existem dados.
          </p>
        </div>
      ) : (
        <PipelineBoard
          pipelineStages={stages}
          leadsByStage={leadsByStage}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onStageUpdate={updateLeadStage}
        />
      )}
    </div>
  );
}
