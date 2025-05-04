
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import React from 'react';

/**
 * Creates a mock localStorage for testing
 */
export function createMockLocalStorage() {
  return {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn()
  };
}

/**
 * Creates mock pipeline data for testing
 */
export function createMockPipelineData() {
  return {
    leadsByStage: {
      '1': [{ id: '1', name: 'Test Lead 1', stage: { id: '1' } }],
      '2': [{ id: '2', name: 'Test Lead 2', stage: { id: '2' } }]
    },
    leadsNeedingAttention: [{ id: '1', name: 'Test Lead 1' }],
    filteredLeads: [
      { id: '1', name: 'Test Lead 1', stage: { id: '1' } },
      { id: '2', name: 'Test Lead 2', stage: { id: '2' } }
    ],
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleSearchLeads: vi.fn(),
    handleFilterByUser: vi.fn(),
    updateLeadStage: vi.fn(),
    addLeadToPipeline: vi.fn()
  };
}

/**
 * Mock the PipelineBoard component
 */
export function mockPipelineBoard() {
  vi.mock('@/components/Pipeline/PipelineBoard', () => ({
    PipelineBoard: (props: {
      pipelineStages: { id: string; name: string }[];
      leadsByStage: Record<string, any[]>;
      onDragStart: (e: React.DragEvent, lead: any) => void;
      onDragOver: (e: React.DragEvent) => void;
      onDrop: (e: React.DragEvent, stageId: string) => void;
      onStageUpdate: (leadId: string, stageId: string) => void;
    }) => {
      const { pipelineStages, leadsByStage, onDragStart, onDragOver, onDrop, onStageUpdate } = props;
      
      return (
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
              onDragOver={onDragOver}
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
      );
    }
  }));
}

/**
 * Mock the PipelineSearch component
 */
export function mockPipelineSearch() {
  vi.mock('@/components/Pipeline/PipelineSearch', () => ({
    PipelineSearch: (props: {
      onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onFilterByUser: (userId: string) => void;
    }) => {
      const { onSearch, onFilterByUser } = props;
      
      return (
        <div data-testid="pipeline-search">
          <input 
            data-testid="search-input" 
            onChange={onSearch}
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
      );
    }
  }));
}

/**
 * Mock the PipelineHeader component
 */
export function mockPipelineHeader() {
  vi.mock('@/components/Pipeline/PipelineHeader', () => ({
    PipelineHeader: (props: { 
      leadsNeedingAttention: any[] 
    }) => {
      const { leadsNeedingAttention } = props;
      
      return (
        <div data-testid="pipeline-header">
          Pipeline Header (Leads needing attention: {leadsNeedingAttention.length})
        </div>
      );
    }
  }));
}

/**
 * Register all pipeline component mocks
 */
export function mockPipelineComponents() {
  mockPipelineBoard();
  mockPipelineSearch();
  mockPipelineHeader();
}

/**
 * Registers all pipeline mocks at once
 */
export function registerPipelineMocks() {
  mockPipelineComponents();
}
