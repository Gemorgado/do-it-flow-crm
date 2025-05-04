
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import Pipeline from '@/pages/Pipeline';
import userEvent from '@testing-library/user-event';
import { usePipelineData } from '@/hooks/usePipelineData';
import { leads, pipelineStages } from '@/data/leadsData';

// Mock dependencies
vi.mock('@/hooks/usePipelineData', () => ({
  usePipelineData: vi.fn()
}));

vi.mock('@/components/Pipeline/PipelineHeader', () => ({
  PipelineHeader: ({ leadsNeedingAttention }) => (
    <div data-testid="pipeline-header">
      Pipeline Header (Leads needing attention: {leadsNeedingAttention.length})
    </div>
  )
}));

vi.mock('@/components/Pipeline/PipelineSearch', () => ({
  PipelineSearch: ({ onSearch, onFilterByUser }) => (
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
  }) => (
    <div data-testid="pipeline-board">
      <div>Total stages: {pipelineStages.length}</div>
      <div data-testid="total-leads">Total leads: {
        Object.values(leadsByStage).reduce((acc, stageLeads) => acc + stageLeads.length, 0)
      }</div>
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
                onClick={() => onStageUpdate(lead.id, '3')} // For testing, clicking moves to stage 3
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

describe('Pipeline Page Interactions', () => {
  // Mock return value for usePipelineData
  const mockUsePipelineDataReturn = {
    leadsByStage: {
      '1': leads.filter(lead => lead.stage.id === '1'),
      '2': leads.filter(lead => lead.stage.id === '2'),
      '3': leads.filter(lead => lead.stage.id === '3'),
      '4': leads.filter(lead => lead.stage.id === '4'),
      '5': leads.filter(lead => lead.stage.id === '5')
    },
    leadsNeedingAttention: leads.slice(0, 2),
    filteredLeads: leads,
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleSearchLeads: vi.fn(),
    handleFilterByUser: vi.fn(),
    updateLeadStage: vi.fn(),
    addLeadToPipeline: vi.fn()
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Set up mock for usePipelineData
    (usePipelineData as jest.Mock).mockReturnValue(mockUsePipelineDataReturn);
  });
  
  it('handles searching for leads', async () => {
    render(<Pipeline />);
    
    // Find search input and type in it
    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'test search');
    
    // Check that handleSearchLeads was called
    expect(mockUsePipelineDataReturn.handleSearchLeads).toHaveBeenCalled();
  });
  
  it('handles filtering by user', async () => {
    render(<Pipeline />);
    
    // Find user filter and select an option
    const userFilter = screen.getByTestId('user-filter');
    await userEvent.selectOptions(userFilter, 'user1');
    
    // Check that handleFilterByUser was called with the correct value
    expect(mockUsePipelineDataReturn.handleFilterByUser).toHaveBeenCalledWith('user1');
  });
  
  // Business Rule 2: Pipeline → Proposal test
  it('moves lead to different stage when clicked', async () => {
    render(<Pipeline />);
    
    // Find a lead element and click it
    const lead = screen.getByTestId('lead-1');
    await userEvent.click(lead);
    
    // Check that updateLeadStage was called with the correct parameters
    expect(mockUsePipelineDataReturn.updateLeadStage).toHaveBeenCalledWith('1', '3');
  });
});
