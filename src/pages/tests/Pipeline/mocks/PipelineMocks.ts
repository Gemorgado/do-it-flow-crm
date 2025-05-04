
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import React from 'react';

/**
 * Chame registerPipelineMocks() no início do seu teste
 * (ex.: dentro de setupMocks.ts ou no próprio arquivo de teste)
 */
export function registerPipelineMocks() {
  /**
   * Mock do PipelineBoard
   * – exibe contagem de estágios e leads
   * – permite drag-and-drop fake e clique para mudar estágio
   */
  vi.mock('@/components/Pipeline/PipelineBoard', () => {
    const PipelineBoard = ({
      pipelineStages,
      leadsByStage,
      onDragStart,
      onDragOver,
      onDrop,
      onStageUpdate,
    }: {
      pipelineStages: { id: string; name: string }[];
      leadsByStage: Record<string, any[]>;
      onDragStart: (e: React.DragEvent, lead: any) => void;
      onDragOver: (e: React.DragEvent) => void;
      onDrop: (e: React.DragEvent, stageId: string) => void;
      onStageUpdate: (leadId: string, stageId: string) => void;
    }) => (
      <div data-testid="pipeline-board">
        <div>Total stages: {pipelineStages.length}</div>
        <div data-testid="total-leads">
          Total leads:{' '}
          {Object.values(leadsByStage).reduce(
            (acc, stageLeads) => acc + stageLeads.length,
            0,
          )}
        </div>

        {pipelineStages.map((stage) => (
          <div
            key={stage.id}
            data-testid={`stage-${stage.id}`}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage.id)}
          >
            <h3>
              {stage.name} ({leadsByStage[stage.id]?.length ?? 0})
            </h3>
            <div>
              {leadsByStage[stage.id]?.map((lead) => (
                <div
                  key={lead.id}
                  data-testid={`lead-${lead.id}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, lead)}
                  onClick={() => onStageUpdate(lead.id, '3')}
                >
                  {lead.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

    /* 👈 É ESSENCIAL retornar um objeto com a prop que tem MESMO nome usado no import */
    return { PipelineBoard };
  });
}
