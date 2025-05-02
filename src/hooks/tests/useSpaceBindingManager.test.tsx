
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSpaceBindingManager } from '../useSpaceBindingManager';
import { useSpaceBindings, useBindSpace, useUnbindSpace } from '../useSpaceBindings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('../useSpaceBindings', () => ({
  useSpaceBindings: vi.fn(),
  useBindSpace: vi.fn(),
  useUnbindSpace: vi.fn()
}));

vi.mock('../spaceBinding/useClientSelection', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation((initialClient) => ({
    selectedClientId: initialClient || null,
    setSelectedClientId: vi.fn(),
    clients: [],
    isLoadingClients: false
  }))
}));

vi.mock('../spaceBinding/useContractDetails', () => ({
  __esModule: true,
  useContractDetails: vi.fn().mockImplementation(() => ({
    contractId: null,
    setContractId: vi.fn(),
    unitPrice: null,
    setUnitPrice: vi.fn(),
    startDate: null,
    setStartDate: vi.fn(),
    endDate: null,
    setEndDate: vi.fn()
  }))
}));

vi.mock('../spaceBinding/useSpaceBindingActions', () => ({
  __esModule: true,
  useSpaceBindingActions: vi.fn().mockImplementation(() => ({
    handleSave: vi.fn(),
    handleUnbind: vi.fn(),
    isLoading: false
  }))
}));

describe('useSpaceBindingManager Hook', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // Mock space and binding data
  const mockSpace = {
    id: 'space-1',
    name: 'Private Room 101',
    type: 'sala_privativa',
    identifier: 'PR101',
    available: true,
    capacity: 4,
    area: 20
  };

  const mockBindings = [
    {
      id: 'binding-1',
      spaceId: 'space-2',
      clientId: 'client-1',
      contractId: 'contract-1',
      boundAt: '2023-01-10T12:00:00Z',
      unitPrice: 1500,
      startDate: '2023-02-01',
      endDate: '2024-01-31'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up default mock return values
    (useSpaceBindings as jest.Mock).mockReturnValue({
      data: mockBindings,
      isLoading: false
    });
    
    (useBindSpace as jest.Mock).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false
    });
    
    (useUnbindSpace as jest.Mock).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false
    });
  });

  it('finds existing binding for the selected space', () => {
    // Create a binding for the space we're testing
    const bindingsWithCurrentSpace = [
      ...mockBindings,
      {
        id: 'binding-2',
        spaceId: 'space-1', // This matches our mockSpace.id
        clientId: 'client-2',
        contractId: 'contract-2',
        boundAt: '2023-01-15T12:00:00Z',
        unitPrice: 2000,
        startDate: '2023-03-01',
        endDate: '2024-02-28'
      }
    ];
    
    (useSpaceBindings as jest.Mock).mockReturnValue({
      data: bindingsWithCurrentSpace,
      isLoading: false
    });

    // Render the hook with the space
    const { result } = renderHook(() => useSpaceBindingManager(mockSpace, vi.fn()), { wrapper });
    
    // The hook should find the existing binding for the space
    expect(result.current.existingBinding).toBeDefined();
    expect(result.current.existingBinding?.spaceId).toBe('space-1');
    expect(result.current.existingBinding?.clientId).toBe('client-2');
  });

  it('returns null for existingBinding when no binding exists for the space', () => {
    // Render the hook with a space that has no binding
    const { result } = renderHook(() => useSpaceBindingManager(mockSpace, vi.fn()), { wrapper });
    
    // The hook should not find any binding
    expect(result.current.existingBinding).toBeNull();
  });

  // Business Rule 4: Space Allocation - Test that clients are fixed on the space map
  it('initializes client selection from existing binding when available', () => {
    // Mock a binding for our space
    const bindingForCurrentSpace = {
      id: 'binding-3',
      spaceId: 'space-1',
      clientId: 'client-3',
      contractId: 'contract-3',
      boundAt: '2023-02-01T12:00:00Z',
      unitPrice: 2500,
      startDate: '2023-04-01',
      endDate: '2024-03-31'
    };
    
    (useSpaceBindings as jest.Mock).mockReturnValue({
      data: [...mockBindings, bindingForCurrentSpace],
      isLoading: false
    });

    // Render the hook
    renderHook(() => useSpaceBindingManager(mockSpace, vi.fn()), { wrapper });
    
    // Check that useClientSelection was called with the client ID from the binding
    const useClientSelectionMock = require('../spaceBinding/useClientSelection').default;
    expect(useClientSelectionMock).toHaveBeenCalledWith('client-3');
  });
});
