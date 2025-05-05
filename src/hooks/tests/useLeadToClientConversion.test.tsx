
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLeadToClientConversion } from '@/presentation/hooks/useLeadToClientConversion';
import { toast } from 'sonner';
import { Lead } from '@/domain/models/Lead';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { UseCaseFactory } from '@/usecases/factory/UseCaseFactory';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/usecases/factory/UseCaseFactory', () => ({
  UseCaseFactory: {
    getConvertLeadToClientUseCase: vi.fn()
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
    status: 'qualified' as any,
    source: 'website_organic' as any,
    createdAt: '2023-01-10T12:00:00Z',
    updatedAt: '2023-01-12T12:00:00Z',
    stageId: '1',
    stage: { id: '1', name: 'Qualified', order: 2, color: '#8b5cf6' },
    assignedTo: 'user1',
    notes: 'Test notes'
  };

  // Mock client result
  const mockClient = {
    id: 'client-1',
    name: 'Test Lead',
    email: 'test@example.com',
    status: 'active',
    services: [
      {
        type: 'fiscal_address',
        value: 500000,
        billingCycle: 'monthly',
        status: 'active'
      }
    ]
  };

  // Mock use case
  const mockConvertUseCase = {
    execute: vi.fn().mockResolvedValue({ client: mockClient, success: true })
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    vi.mocked(UseCaseFactory.getConvertLeadToClientUseCase).mockReturnValue(mockConvertUseCase as any);
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
    
    // Assert: Check use case was called with the correct params
    expect(UseCaseFactory.getConvertLeadToClientUseCase).toHaveBeenCalled();
    expect(mockConvertUseCase.execute).toHaveBeenCalledWith(
      'test-lead-id', 
      expect.objectContaining({
        serviceType: 'fiscal_address',
        contractValue: 500000
      })
    );
    
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
    // Setup use case to throw an error
    mockConvertUseCase.execute.mockRejectedValueOnce(new Error('Database error'));
    
    const { result } = renderHook(() => useLeadToClientConversion(), { wrapper });
    
    // Act: Try to convert the lead
    let convertedClient;
    await act(async () => {
      convertedClient = await result.current.convertLeadToClient(mockLead, 'fiscal_address', 500000);
    });
    
    // Assert: Check that error handling worked correctly
    expect(convertedClient).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Failed to convert lead to client');
    expect(result.current.isConverting).toBe(false);
  });
});
