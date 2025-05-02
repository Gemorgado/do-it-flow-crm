
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { LeadCard } from '../LeadCard';
import userEvent from '@testing-library/user-event';

describe('LeadCard Component', () => {
  // Mock functions
  const mockOnDragStart = vi.fn();
  const mockOnStageUpdate = vi.fn();
  
  // Mock lead data
  const mockLead = {
    id: '1',
    name: 'Test Lead',
    company: 'Test Company',
    email: 'test@example.com',
    phone: '123456789',
    status: 'novo' as const,
    source: 'site_organico' as const,
    createdAt: '2023-01-10T12:00:00Z',
    updatedAt: '2023-01-12T12:00:00Z',
    stage: {
      id: '1',
      name: 'Novo',
      order: 1,
      color: '#3b82f6'
    },
    value: 5000
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders lead information correctly', () => {
    render(
      <LeadCard 
        lead={mockLead}
        onDragStart={mockOnDragStart}
        onStageUpdate={mockOnStageUpdate}
      />
    );
    
    // Check that lead name and company are displayed
    expect(screen.getByText('Test Lead')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    
    // Check that value is formatted correctly
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument();
  });
  
  it('calls onDragStart when dragging starts', () => {
    render(
      <LeadCard 
        lead={mockLead}
        onDragStart={mockOnDragStart}
        onStageUpdate={mockOnStageUpdate}
      />
    );
    
    // Get the card element (the first element that has draggable=true)
    const card = screen.getByText('Test Lead').closest('[draggable=true]');
    expect(card).toBeDefined();
    
    // Simulate drag start
    if (card) {
      fireEvent.dragStart(card);
      expect(mockOnDragStart).toHaveBeenCalledTimes(1);
      expect(mockOnDragStart.mock.calls[0][1]).toEqual(mockLead);
    }
  });
  
  it('formats lead value correctly', () => {
    // Render with a lead that has a different value
    render(
      <LeadCard 
        lead={{ ...mockLead, value: 1234.56 }}
        onDragStart={mockOnDragStart}
        onStageUpdate={mockOnStageUpdate}
      />
    );
    
    // Check that value is formatted correctly with decimal places
    expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
  });
  
  // Business Rule 2: Test message triggers stage progression
  it('updates lead stage when sending message with keywords', async () => {
    // Mock the message dialog
    vi.mock('../WhatsAppDialog', () => ({
      WhatsAppDialog: ({ open, onOpenChange, lead, onMessageSent }) => {
        if (!open) return null;
        
        return (
          <div data-testid="mock-whatsapp-dialog">
            <button 
              onClick={() => onMessageSent('Enviei a proposta para o cliente')}
              data-testid="send-proposal-message"
            >
              Send Proposal Message
            </button>
            <button onClick={() => onOpenChange(false)}>Close</button>
          </div>
        );
      }
    }));
    
    // Re-import LeadCard after mocking
    const { LeadCard } = await import('../LeadCard');
    
    render(
      <LeadCard 
        lead={mockLead}
        onDragStart={mockOnDragStart}
        onStageUpdate={mockOnStageUpdate}
      />
    );
    
    // Open WhatsApp dialog by clicking the message button
    const messageButton = screen.getAllByRole('button')[2]; // Third button is the message button
    await userEvent.click(messageButton);
    
    // Now the mock dialog should be visible
    const sendProposalButton = await screen.findByTestId('send-proposal-message');
    await userEvent.click(sendProposalButton);
    
    // Check that onStageUpdate was called with the correct parameters
    expect(mockOnStageUpdate).toHaveBeenCalledWith('1', '3'); // Moving to stage 3 (Proposal)
  });
});
