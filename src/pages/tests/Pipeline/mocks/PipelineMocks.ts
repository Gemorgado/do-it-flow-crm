
import { vi } from 'vitest';
import { Lead, PipelineStage } from '@/types';
import React from 'react';

// Common mock factory functions to be reused across pipeline tests
export const createMockLocalStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => delete store[key],
    clear: () => {
      store = {};
    },
    length: 0,
    key: vi.fn()
  };
};

// Create a reusable mock for the PipelineData hook results
export const createMockPipelineData = (leads: Lead[], stages: PipelineStage[]) => {
  // Group leads by pipeline stage
  const leadsByStage: Record<string, Lead[]> = {};
  
  stages.forEach(stage => {
    leadsByStage[stage.id] = leads.filter(
      lead => lead.stage.id === stage.id
    );
  });

  return {
    leadsByStage,
    filteredLeads: leads,
    leadsNeedingAttention: leads.slice(0, 2),
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleSearchLeads: vi.fn(),
    handleFilterByUser: vi.fn(),
    updateLeadStage: vi.fn(),
    addLeadToPipeline: vi.fn()
  };
};

// Mock components that are commonly used in tests
export const mockPipelineComponents = () => {
  vi.mock('@/components/Pipeline/PipelineHeader', () => ({
    PipelineHeader: ({ leadsNeedingAttention }: { leadsNeedingAttention: Lead[] }) => (
      <div data-testid="pipeline-header">
        Pipeline Header (Leads needing attention: {leadsNeedingAttention.length})
      </div>
    )
  }));

  vi.mock('@/components/Pipeline/PipelineSearch', () => ({
    PipelineSearch: ({ 
      onSearch, 
      onFilterByUser 
    }: { 
      onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onFilterByUser: (value: string) => void;
    }) => (
      <div data-testid="pipeline-search">
        <input 
          data-testid="search-input" 
          onChange={(e) => onSearch(e)}
          placeholder="Search leads" 
        />
        <select 
          data-testid="user-filter" 
          onChange={(e) => onFilterByUser(e.target.value)}
        >
          <option value="all">All users</option>
          <option value="user1">User 1</option>
        </select>
      </div>
    )
  }));

  vi.mock('@/components/Pipeline/PipelineBoard', () => ({
    PipelineBoard: ({ 
      pipelineStages, 
      leadsByStage, 
      onDragStart, 
      onDragOver, 
      onDrop, 
      onStageUpdate 
    }: { 
      pipelineStages: PipelineStage[];
      leadsByStage: Record<string, Lead[]>;
      onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: Lead) => void;
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
      onDrop: (e: React.DragEvent<HTMLDivElement>, stageId: string) => void;
      onStageUpdate: (leadId: string, stageId: string) => void;
    }) => (
      <div data-testid="pipeline-board">
        <div>Total stages: {pipelineStages.length}</div>
        <div data-testid="total-leads">
          Total leads: {
            Object.values(leadsByStage).reduce((acc, stageLeads) => acc + stageLeads.length, 0)
          }
        </div>
        {pipelineStages.map((stage) => (
          <div 
            key={stage.id} 
            data-testid={`stage-${stage.id}`}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, stage.id)}
          >
            <h3>{stage.name} ({leadsByStage[stage.id]?.length || 0})</h3>
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
    )
  }));
};
