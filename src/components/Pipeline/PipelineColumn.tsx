
import { PipelineStage, Lead } from "@/types";
import { Plus } from "lucide-react";
import { LeadCard } from "./LeadCard";

interface PipelineColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onStageUpdate?: (leadId: string, newStageId: string) => void;
}

export function PipelineColumn({ 
  stage, 
  leads, 
  onDragOver, 
  onDrop, 
  onDragStart,
  onStageUpdate
}: PipelineColumnProps) {
  return (
    <div 
      className="flex-1 min-w-[300px] max-w-[320px]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="font-medium flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: stage.color }} 
          />
          {stage.name}
          <span className="ml-1 text-sm text-gray-500">({leads.length})</span>
        </h3>
      </div>
      
      <div className="space-y-3 min-h-[300px] p-2 rounded-md border-2 border-dashed border-gray-200 bg-gray-50">
        {leads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead}
            onDragStart={onDragStart}
            onStageUpdate={onStageUpdate}
          />
        ))}
        
        {leads.length === 0 && (
          <div className="border border-dashed border-gray-200 rounded-md p-4 text-center text-gray-400 text-sm h-24 flex items-center justify-center">
            Arraste leads para esta coluna
          </div>
        )}
        
        <button className="w-full border border-dashed border-gray-200 rounded-md p-3 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
          <Plus className="h-4 w-4 mr-1" /> Adicionar Lead
        </button>
      </div>
    </div>
  );
}
