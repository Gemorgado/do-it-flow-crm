
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLeadToClientConversion } from '../useLeadToClientConversion';
import { persistence } from '@/integrations/persistence';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('@/integrations/persistence', () => ({
  persistence: {
    createClient: vi.fn().mockImplementation((client) => Promise.resolve({...client})),
  }
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue(Promise.resolve({ error: null }))
      })
    })
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useLeadToClientConversion Hook', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // Sample lead for testing
  const mockLead: Lead = {
    id: 'test-lead-id',
    name: 'Test Lead',
    company: 'Test Company',
    email: 'test@example.com',
    phone: '123456789',
    status: 'qualificado' as any,
    source: 'site_organico' as any,
    createdAt: '2023-01-10T12:00:00Z',
    updatedAt: '2023-01-12T12:00:00Z',
    stage: { id: '1', name: 'Qualificado', order: 2, color: '#8b5cf6' },
    assignedTo: 'user1',
    notes: 'Test notes'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('converts a lead to client successfully', async () => {
    const { result } = renderHook(() => useLeadToClientConversion(), { wrapper });
    
    // Initial state should have isConverting = false
    expect(result.current.isConverting).toBe(false);
    
    // Act: Convert the lead to a client
    let convertedClient;
    await act(async () => {
      convertedClient = await result.current.convertLeadToClient(mockLead, 'fiscal_address', 500000);
    });
    
    // Assert: Check persistence.createClient was called with correct data
    expect(persistence.createClient).toHaveBeenCalledTimes(1);
    expect(persistence.createClient).toHaveBeenCalledWith(expect.objectContaining({
      name: mockLead.name,
      company: mockLead.company,
      email: mockLead.email,
      phone: mockLead.phone,
      status: 'active',
      assignedTo: mockLead.assignedTo,
      notes: mockLead.notes
    }));
    
    // Assert: Check supabase update was called to mark lead as converted
    expect(supabase.from).toHaveBeenCalledWith('leads');
    expect(supabase.from().update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'converted',
      stage_id: null
    }));
    expect(supabase.from().update().eq).toHaveBeenCalledWith('id', mockLead.id);
    
    // Assert: Check success toast was shown with the correct message
    expect(toast.success).toHaveBeenCalledWith('Lead successfully converted to client');
    
    // Assert: Check the returned client has expected properties
    expect(convertedClient).toEqual(expect.objectContaining({
      name: mockLead.name,
      email: mockLead.email,
      status: 'active'
    }));
    
    // Assert: Check that the client has a service with the correct data
    expect(convertedClient.services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'fiscal_address',
          value: 500000,
          billingCycle: 'monthly',
          status: 'active'
        })
      ])
    );
  });

  it('handles errors during conversion', async () => {
    // Setup persistence to throw an error
    vi.mocked(persistence.createClient).mockRejectedValueOnce(new Error('Database error'));
    
    const { result } = renderHook(() => useLeadToClientConversion(), { wrapper });
    
    // Act: Try to convert the lead
    let convertedClient;
    await act(async () => {
      convertedClient = await result.current.convertLeadToClient(mockLead);
    });
    
    // Assert: Check that error handling worked correctly
    expect(convertedClient).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Failed to convert lead to client');
    expect(result.current.isConverting).toBe(false);
  });
});
