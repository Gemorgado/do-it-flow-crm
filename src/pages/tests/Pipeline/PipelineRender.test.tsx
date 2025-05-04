
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Pipeline from '@/pages/Pipeline';
import { usePipelineData } from '@/hooks/usePipelineData';
import { leads, pipelineStages } from '@/data/leadsData';
import { Lead } from '@/types';

// Mock dependencies
vi.mock('@/hooks/usePipelineData', () => ({
  usePipelineData: vi.fn()
}));

vi.mock('@/components/Pipeline/PipelineHeader', () => ({
  PipelineHeader: ({ leadsNeedingAttention }: { leadsNeedingAttention: Lead[] }) => (
    <div data-testid="pipeline-header">
      Pipeline Header (Leads needing attention: {leadsNeedingAttention.length})
    </div>
  )
}));

vi.mock('@/components/Pipeline/PipelineSearch', () => ({
  PipelineSearch: ({ onSearch, onFilterByUser }: { 
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    onFilterByUser: (value: string) => void 
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
    pipelineStages: any[], 
    leadsByStage: Record<string, any[]>,
    onDragStart: (e: any, lead: any) => void,
    onDragOver: (e: any) => void,
    onDrop: (e: any, stageId: string) => void,
    onStageUpdate: (leadId: string, newStageId: string) => void
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

describe('Pipeline Page Rendering', () => {
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
});
