import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pipeline from '@/pages/Pipeline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LeadModalProvider } from '@/components/CRM/hooks/useModalContext';
import { toast } from 'sonner';
import { persistence } from '@/integrations/persistence';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/integrations/persistence', () => ({
  persistence: {
    createLead: vi.fn().mockResolvedValue({}),
    listLeads: vi.fn().mockResolvedValue([]),
    updateLead: vi.fn().mockResolvedValue({})
  }
}));

vi.mock('@/components/CRM/LeadForm', () => ({
  LeadForm: ({ onSubmit }) => (
    <form
      data-testid="lead-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          companyOrPerson: "Test Company",
          idNumber: "123456789",
          entryDate: new Date().toISOString(),
          sourceCategory: "outro",
          stageId: "1",
          email: "test@example.com",
          phone: "1234567890"
        });
      }}
    >
      <input type="text" placeholder="Company Name" />
      <button type="submit" data-testid="submit-lead-form">
        Submit
      </button>
    </form>
  )
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <LeadModalProvider>
        {component}
      </LeadModalProvider>
    </QueryClientProvider>
  );
};

describe('Pipeline Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });
    
    // Mock persistence.createLead to return a proper lead object
    vi.mocked(persistence.createLead).mockImplementation(async (lead) => {
      return lead;
    });
  });

  it('adds new lead to pipeline after creation', async () => {
    // Arrange
    renderWithProviders(<Pipeline />);
    
    // Look for "Add Lead" button in first column
    const addLeadButton = await screen.findByTestId('add-lead-to-1');
    
    // Act - open the modal and submit the form
    await userEvent.click(addLeadButton);
    
    // Submit the form
    const submitButton = await screen.findByTestId('submit-lead-form');
    fireEvent.click(submitButton);
    
    // Assert
    await waitFor(() => {
      // Check that leadPersistence.createLead was called
      expect(persistence.createLead).toHaveBeenCalled();
      
      // Check that success toast was displayed
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
