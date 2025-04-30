
import { PipelineHeader } from "@/components/Pipeline/PipelineHeader";
import { PipelineSearch } from "@/components/Pipeline/PipelineSearch";
import { PipelineBoard } from "@/components/Pipeline/PipelineBoard";
import { leads, pipelineStages } from "@/data/leadsData";
import { usePipelineData } from "@/hooks/usePipelineData";

export default function Pipeline() {
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

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <PipelineHeader leadsNeedingAttention={leadsNeedingAttention} />
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
