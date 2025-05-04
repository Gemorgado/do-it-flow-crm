
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

// Mock useSpaceBinderManager
vi.mock('../useSpaceBinderManager', () => ({
  __esModule: true,
  default: () => ({
    spaces: [],
    bindings: [],
    isLoading: false,
    isSpaceAllocated: vi.fn(),
    getSpaceBinding: vi.fn(),
    allocateSpace: vi.fn(),
    deallocateSpace: vi.fn(),
    updateSpaceBinding: vi.fn(),
    getAvailableSpaces: vi.fn()
  })
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

  it('initializes with default bindings array when none provided', () => {
    const { result } = renderHook(() => useSpaceBindingManager(), { wrapper });
    
    expect(result.current.bindings).toEqual([]);
    expect(result.current.isLoading).toBe(true); // Should initially be loading
  });

  it('loads spaces and bindings data on mount', async () => {
    const { result } = renderHook(() => useSpaceBindingManager(), { wrapper });
    
    // Mock the return value of space and binding queries
    (useSpaceBindings as jest.Mock).mockReturnValue({
      data: mockBindings,
      isLoading: false
    });
    
    // Force a re-render
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('correctly identifies if a space is allocated', () => {
    const { result } = renderHook(() => useSpaceBindingManager(mockBindings), { wrapper });
    
    expect(result.current.isSpaceAllocated('space-2')).toBe(true);
    expect(result.current.isSpaceAllocated('space-1')).toBe(false);
  });

  it('returns the binding for a specific space', () => {
    const { result } = renderHook(() => useSpaceBindingManager(mockBindings), { wrapper });
    
    const binding = result.current.getSpaceBinding('space-2');
    expect(binding).toBeDefined();
    expect(binding?.spaceId).toBe('space-2');
    expect(binding?.clientId).toBe('client-1');
  });
});
