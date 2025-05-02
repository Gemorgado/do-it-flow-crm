
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadForm } from '../LeadForm';
import { leadPersistence } from '@/integrations/persistence/leadPersistence';

// Mock dependencies
vi.mock('@/integrations/persistence/leadPersistence', () => ({
  leadPersistence: {
    createLead: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

// Mock hook form context
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
  };
});

describe('LeadForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockPresetStage = {
    id: "2",
    name: "Qualificação",
    order: 2,
    color: "#4ade80"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with the correct fields', () => {
    render(
      <LeadForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        presetStage={mockPresetStage}
        isSubmitting={false}
      />
    );

    // Check for key form elements
    expect(screen.getByText('Informações básicas')).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa ou pessoa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de entrada/i)).toBeInTheDocument();
    expect(screen.getByText('Notas adicionais')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Criar lead')).toBeInTheDocument();
  });

  it('should call the cancel function when cancel button is clicked', async () => {
    render(
      <LeadForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        presetStage={mockPresetStage}
        isSubmitting={false}
      />
    );
    
    const cancelButton = screen.getByText('Cancelar');
    await userEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  // This is a more complex test that would require more setup
  // In a real scenario, you'd want to test form submission
  it('should attempt to submit the form with valid data', async () => {
    render(
      <LeadForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        presetStage={mockPresetStage}
        isSubmitting={false}
      />
    );
    
    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/Empresa ou pessoa/i), 'Test Company');
    
    // Submit the form
    const submitButton = screen.getByText('Criar lead');
    await userEvent.click(submitButton);
    
    // In a real test, you'd want to wait for form submission and validation
    // This is a simplified version
    await waitFor(() => {
      expect(leadPersistence.createLead).toHaveBeenCalled();
    });
  });
});
