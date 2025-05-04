
import { vi } from 'vitest';
import { Lead, PipelineStage } from '@/types';

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
      '1': [{ id: '1', name: 'Test Lead 1', stage: { id: '1' } } as Lead],
      '2': [{ id: '2', name: 'Test Lead 2', stage: { id: '2' } } as Lead]
    },
    leadsNeedingAttention: [{ id: '1', name: 'Test Lead 1' } as Lead],
    filteredLeads: [
      { id: '1', name: 'Test Lead 1', stage: { id: '1' } } as Lead,
      { id: '2', name: 'Test Lead 2', stage: { id: '2' } } as Lead
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
    PipelineBoard: ({ 
      pipelineStages, 
      leadsByStage,
      onDragStart,
      onDragOver,
      onDrop,
      onStageUpdate 
    }) => {
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
    PipelineSearch: ({ onSearch, onFilterByUser }) => {
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
    PipelineHeader: ({ leadsNeedingAttention }) => {
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
