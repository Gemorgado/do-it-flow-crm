
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSpaceBindingActions } from '../useSpaceBindingActions';
import { useBindSpace, useUnbindSpace } from '@/hooks/useSpaceBindings';
import { toast } from 'sonner';
import { Location } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('@/hooks/useSpaceBindings', () => ({
  useBindSpace: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isLoading: false,
  }),
  useUnbindSpace: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('test-uuid-123')
}));

describe('useSpaceBindingActions Hook', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // Sample data for testing
  const mockSpace: Location = {
    id: 'space-123',
    name: 'Meeting Room A',
    type: 'meeting_room',
    floor: 1,
    isActive: true,
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:00:00Z'
  };

  const onCloseMock = vi.fn();
  const bindSpaceMutateMock = vi.fn();
  const unbindSpaceMutateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mocks for each test
    vi.mocked(useBindSpace).mockReturnValue({
      mutate: bindSpaceMutateMock,
      isLoading: false,
    });
    
    vi.mocked(useUnbindSpace).mockReturnValue({
      mutate: unbindSpaceMutateMock,
      isLoading: false,
    });
  });

  it('should not allow save when required fields are missing', () => {
    // Test with missing client ID
    const { result: resultNoClient } = renderHook(() => useSpaceBindingActions({
      space: mockSpace,
      selectedClientId: null,
      contractId: 'contract-123',
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    expect(resultNoClient.current.canSave).toBe(false);
    
    // Test with missing contract ID
    const { result: resultNoContract } = renderHook(() => useSpaceBindingActions({
      space: mockSpace,
      selectedClientId: 'client-123',
      contractId: null,
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    expect(resultNoContract.current.canSave).toBe(false);
    
    // Test with missing space
    const { result: resultNoSpace } = renderHook(() => useSpaceBindingActions({
      space: null,
      selectedClientId: 'client-123',
      contractId: 'contract-123',
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    expect(resultNoSpace.current.canSave).toBe(false);
  });

  it('should allow save when all required fields are provided', () => {
    const { result } = renderHook(() => useSpaceBindingActions({
      space: mockSpace,
      selectedClientId: 'client-123',
      contractId: 'contract-123',
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    expect(result.current.canSave).toBe(true);
  });

  it('should save binding correctly with all required fields', async () => {
    const { result } = renderHook(() => useSpaceBindingActions({
      space: mockSpace,
      selectedClientId: 'client-123',
      contractId: 'contract-123',
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    // Act: Save the binding
    await act(async () => {
      result.current.handleSave();
    });
    
    // Assert: Check if bindSpace was called with correct data
    expect(bindSpaceMutateMock).toHaveBeenCalledWith({
      id: 'test-uuid-123',
      spaceId: 'space-123',
      clientId: 'client-123',
      contractId: 'contract-123',
      boundAt: expect.any(String),
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31'
    });
    
    // Assert: Check if onClose was called
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should show error toast when trying to save with missing space', async () => {
    const { result } = renderHook(() => useSpaceBindingActions({
      space: null,
      selectedClientId: 'client-123',
      contractId: 'contract-123',
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    // Act: Try to save the binding
    await act(async () => {
      result.current.handleSave();
    });
    
    // Assert: Check if toast.error was called
    expect(toast.error).toHaveBeenCalled();
    expect(bindSpaceMutateMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('should unbind space correctly', async () => {
    const { result } = renderHook(() => useSpaceBindingActions({
      space: mockSpace,
      selectedClientId: 'client-123',
      contractId: 'contract-123',
      unitPrice: 100000,
      startDate: '2023-02-01',
      endDate: '2023-12-31',
      onClose: onCloseMock
    }), { wrapper });
    
    // Act: Unbind the space
    await act(async () => {
      result.current.handleUnbind();
    });
    
    // Assert: Check if unbindSpace was called with correct ID
    expect(unbindSpaceMutateMock).toHaveBeenCalledWith('space-123');
    expect(onCloseMock).toHaveBeenCalled();
  });
});
