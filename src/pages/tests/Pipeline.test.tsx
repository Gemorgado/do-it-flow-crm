
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Pipeline from '@/pages/Pipeline';
import userEvent from '@testing-library/user-event';
import { usePipelineData } from '@/hooks/usePipelineData';
import { leads, pipelineStages } from '@/data/leadsData';
import React from 'react'; // Add React import for ReactNode type

// DIAGNOSTIC BEFORE FIX:
// vi.mock('@/components/Pipeline/PipelineBoard', () => ({
//   PipelineBoard: ({ pipelineStages, leadsByStage, onDragStart, onDragOver, onDrop, onStageUpdate }) => (
//     <div data-testid="pipeline-board">
//       <div>Total stages: {pipelineStages.length}</div>
//       <div data-testid="total-leads">Total leads: {
//         Object.values(leadsByStage).reduce((acc, stageLeads) => acc + stageLeads.length, 0)
//       }</div>

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
  PipelineBoard: ({ pipelineStages, leadsByStage, onDragStart, onDragOver, onDrop, onStageUpdate }) => (
    <div data-testid="pipeline-board">
      <div>Total stages: {pipelineStages.length}</div>
      <div data-testid="total-leads">Total leads: {
        Object.values(leadsByStage).reduce((acc: number, stageLeads: any[]) => acc + stageLeads.length, 0)
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
            {leadsByStage[stage.id]?.map((lead: any) => (
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

describe('Pipeline Page', () => {
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
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleSearchLeads: vi.fn(),
    handleFilterByUser: vi.fn(),
    updateLeadStage: vi.fn()
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
  
  it('renders pipeline components correctly', () => {
    render(<Pipeline />);
    
    // Check that main components are rendered
    expect(screen.getByTestId('pipeline-header')).toBeInTheDocument();
    expect(screen.getByTestId('pipeline-search')).toBeInTheDocument();
    expect(screen.getByTestId('pipeline-board')).toBeInTheDocument();
  });
  
  it('initializes with data from localStorage if available', async () => {
    // Set mock localStorage data
    const mockStoredLeads = JSON.stringify(leads.slice(0, 3));
    const mockStoredStages = JSON.stringify(pipelineStages.slice(0, 3));
    localStorage.setItem('leads', mockStoredLeads);
    localStorage.setItem('pipeline_stages', mockStoredStages);
    
    render(<Pipeline />);
    
    // Wait for effect to run
    await waitFor(() => {
      expect(usePipelineData).toHaveBeenCalled();
    });
    
    // Check that usePipelineData was called with data from localStorage
    const [calledLeads, calledStages] = (usePipelineData as jest.Mock).mock.calls[0];
    expect(calledLeads.length).toBe(3); // We stored 3 leads
    expect(calledStages.length).toBe(3); // We stored 3 stages
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

