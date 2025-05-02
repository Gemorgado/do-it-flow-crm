
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { LeadForm } from '../LeadForm';
import { leadPersistence } from '@/integrations/persistence/leadPersistence';
import { toast } from '@/hooks/use-toast';

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
    expect(screen.getByText('Detalhes adicionais')).toBeInTheDocument();
    expect(screen.getByText('Origem')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
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
    
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    await userEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <LeadForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        presetStage={mockPresetStage}
        isSubmitting={false}
      />
    );
    
    // Submit the empty form
    const submitButton = screen.getByRole('button', { name: /Salvar/i });
    await userEvent.click(submitButton);
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/corrija os seguintes erros/i)).toBeInTheDocument();
    });
    
    // Ensure the onSubmit callback wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
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
    await userEvent.type(screen.getByLabelText(/Serviço de Interesse/i), 'Test Service');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Salvar/i });
    await userEvent.click(submitButton);
    
    // Wait for form submission
    await waitFor(() => {
      expect(leadPersistence.createLead).toHaveBeenCalled();
    });
    
    // Check that the form submission went through
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
