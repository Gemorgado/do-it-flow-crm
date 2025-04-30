
import { PipelineColumn } from "./PipelineColumn";
import { PipelineStage, Lead } from "@/types";

interface PipelineBoardProps {
  pipelineStages: PipelineStage[];
  leadsByStage: Record<string, Lead[]>;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageId: string) => void;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onStageUpdate: (leadId: string, newStageId: string) => void;
}

export function PipelineBoard({
  pipelineStages,
  leadsByStage,
  onDragOver,
  onDrop,
  onDragStart,
  onStageUpdate
}: PipelineBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      {pipelineStages.map((stage) => (
        <PipelineColumn
          key={stage.id}
          stage={stage}
          leads={leadsByStage[stage.id] || []}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, stage.id)}
          onDragStart={onDragStart}
          onStageUpdate={onStageUpdate}
        />
      ))}
    </div>
  );
}
