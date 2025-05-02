
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { usePipelineData } from '../usePipelineData';
import { trackLeadEvent } from '@/utils/trackingUtils';
import { trackStageChange } from '@/utils/pipelineAutomation';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('@/utils/trackingUtils', () => ({
  trackLeadEvent: vi.fn()
}));

vi.mock('@/utils/pipelineAutomation', () => ({
  getLeadsNeedingAttention: vi.fn().mockReturnValue([]),
  triggerAutomation: vi.fn(),
  trackStageChange: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('usePipelineData Hook', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // Mock pipeline stages
  const mockStages = [
    { id: '1', name: 'Novo', order: 1, color: '#3b82f6' },
    { id: '2', name: 'Qualificado', order: 2, color: '#8b5cf6' },
    { id: '3', name: 'Proposta', order: 3, color: '#10b981' },
    { id: '4', name: 'Negociação', order: 4, color: '#f59e0b' },
    { id: '5', name: 'Fechado', order: 5, color: '#22c55e' }
  ];

  // Mock leads
  const mockLeads = [
    {
      id: '1',
      name: 'Lead 1',
      email: 'lead1@example.com',
      phone: '123456789',
      status: 'novo' as const,
      source: 'site_organico' as const,
      createdAt: '2023-01-10T12:00:00Z',
      updatedAt: '2023-01-12T12:00:00Z',
      stage: { ...mockStages[0] }
    },
    {
      id: '2',
      name: 'Lead 2',
      email: 'lead2@example.com',
      phone: '987654321',
      status: 'qualificado' as const,
      source: 'google_ads' as const,
      createdAt: '2023-01-11T12:00:00Z',
      updatedAt: '2023-01-13T12:00:00Z',
      stage: { ...mockStages[1] }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('initializes with the provided leads and stages', () => {
    const { result } = renderHook(() => usePipelineData(mockLeads, mockStages), { wrapper });
    
    expect(result.current.filteredLeads).toEqual(mockLeads);
    expect(Object.keys(result.current.leadsByStage).length).toBe(mockStages.length);
    expect(result.current.leadsByStage['1'].length).toBe(1); // One lead in first stage
    expect(result.current.leadsByStage['2'].length).toBe(1); // One lead in second stage
  });

  it('tracks page view on component mount', () => {
    renderHook(() => usePipelineData(mockLeads, mockStages), { wrapper });
    
    expect(trackLeadEvent).toHaveBeenCalledWith('pipeline_view', {
      leads_count: mockLeads.length,
      page_name: 'Pipeline de Vendas'
    });
  });

  // Business Rule 2: Pipeline → Proposal - Test moving leads between columns
  it('updates lead stage when moving between columns', () => {
    const { result } = renderHook(() => usePipelineData(mockLeads, mockStages), { wrapper });
    
    // Act: Move lead from stage 1 (Novo) to stage 3 (Proposta)
    act(() => {
      result.current.updateLeadStage('1', '3');
    });
    
    // Assert: Check if lead was moved correctly
    expect(trackStageChange).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), '3');
    expect(toast.success).toHaveBeenCalled();
    
    // Check if lead's stage was updated in the state
    const updatedLead = result.current.filteredLeads.find(lead => lead.id === '1');
    expect(updatedLead?.stage.id).toBe('3');
    expect(updatedLead?.stage.name).toBe('Proposta');
  });

  it('filters leads by search term', () => {
    const { result } = renderHook(() => usePipelineData(mockLeads, mockStages), { wrapper });
    
    // Create a mock event
    const mockEvent = {
      target: { value: 'lead1' }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Act: Search for "lead1"
    act(() => {
      result.current.handleSearchLeads(mockEvent);
    });
    
    // Assert: Check if only Lead 1 is displayed
    expect(result.current.filteredLeads.length).toBe(1);
    expect(result.current.filteredLeads[0].id).toBe('1');
  });

  it('filters leads by assigned user', () => {
    // Create mock leads with assignedTo property
    const leadsWithAssignedUsers = [
      { ...mockLeads[0], assignedTo: 'user1' },
      { ...mockLeads[1], assignedTo: 'user2' }
    ];
    
    const { result } = renderHook(() => usePipelineData(leadsWithAssignedUsers, mockStages), { wrapper });
    
    // Act: Filter by user1
    act(() => {
      result.current.handleFilterByUser('user1');
    });
    
    // Assert: Check if only leads assigned to user1 are displayed
    expect(result.current.filteredLeads.length).toBe(1);
    expect(result.current.filteredLeads[0].id).toBe('1');
  });
});
