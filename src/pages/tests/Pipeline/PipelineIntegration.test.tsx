import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Pipeline from '@/pages/Pipeline';
import { mockedLeads, mockedPipelineStages } from './mocks/PipelineMocks';
import { persistence } from '@/integrations/persistence';

// Mock the persistence module
vi.mock('@/integrations/persistence', () => {
  const leads = [...mockedLeads]; // Create a mutable copy
  
  return {
    persistence: {
      listLeads: vi.fn(() => Promise.resolve(leads)),
      updateLead: vi.fn((updatedLead) => {
        const index = leads.findIndex(lead => lead.id === updatedLead.id);
        if (index !== -1) {
          leads[index] = updatedLead;
        }
        return Promise.resolve(updatedLead);
      }),
    },
  };
});

describe('Pipeline Integration', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient();
  });
  
  afterEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });
  
  it('should render the pipeline stages and leads', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Pipeline />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(mockedPipelineStages[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockedLeads[0].name)).toBeInTheDocument();
    });
  });
  
  it('should allow dragging and dropping a lead to a different stage', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Pipeline />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(mockedPipelineStages[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockedLeads[0].name)).toBeInTheDocument();
    });
    
    const leadElement = screen.getByText(mockedLeads[0].name);
    const targetStageElement = screen.getByText(mockedPipelineStages[1].name);
    
    // Mock the drag and drop events
    fireEvent.dragStart(leadElement);
    fireEvent.dragEnter(targetStageElement);
    fireEvent.dragOver(targetStageElement);
    fireEvent.drop(targetStageElement);
    fireEvent.dragEnd(leadElement);
    
    // Wait for the update to complete
    await waitFor(() => {
      expect(persistence.updateLead).toHaveBeenCalledTimes(1);
    });
  });
});
