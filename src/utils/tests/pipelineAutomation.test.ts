
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getTimeInCurrentStage, 
  isLeadStale, 
  needsFollowUp,
  triggerAutomation,
  trackStageChange
} from '../pipelineAutomation';
import { trackLeadEvent } from '../trackingUtils';
import { toast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('../trackingUtils', () => ({
  trackLeadEvent: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('Pipeline Automation Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Mock lead data
  const mockLead = {
    id: '1',
    name: 'Test Lead',
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
    }
  };

  it('calculates time in current stage correctly', () => {
    const result = getTimeInCurrentStage(mockLead);
    // 3 days in milliseconds (Jan 12 to Jan 15)
    const expectedTime = 3 * 24 * 60 * 60 * 1000;
    expect(result).toBe(expectedTime);
  });

  it('detects stale leads correctly', () => {
    // The default threshold is 7 days, our lead is 3 days old so it shouldn't be stale
    expect(isLeadStale(mockLead)).toBe(false);
    
    // Create a lead that was updated 8 days ago
    const staleLead = {
      ...mockLead,
      updatedAt: '2023-01-07T12:00:00Z'
    };
    
    expect(isLeadStale(staleLead)).toBe(true);
  });

  it('detects leads that need follow-up correctly', () => {
    // Lead without nextFollowUp date
    expect(needsFollowUp(mockLead)).toBe(false);
    
    // Lead with future nextFollowUp date
    const leadWithFutureFollowUp = {
      ...mockLead,
      nextFollowUp: '2023-01-20T12:00:00Z'
    };
    expect(needsFollowUp(leadWithFutureFollowUp)).toBe(false);
    
    // Lead with past nextFollowUp date
    const leadWithPastFollowUp = {
      ...mockLead,
      nextFollowUp: '2023-01-14T12:00:00Z'
    };
    expect(needsFollowUp(leadWithPastFollowUp)).toBe(true);
  });

  it('tracks stage changes and dispatches events', () => {
    // Test moving from "Novo" to "Qualificado"
    trackStageChange(mockLead, '2');
    
    expect(trackLeadEvent).toHaveBeenCalledWith('lead_qualified', {
      lead_id: '1',
      lead_name: 'Test Lead',
      previous_stage: 'Novo',
      new_stage_id: '2',
      lead_value: 0
    });
  });

  // Business Rule 2: Pipeline → Proposal test
  it('should track when a lead moves to the proposal stage', () => {
    // Test moving a lead to the proposal stage (id: 3)
    trackStageChange(mockLead, '3');
    
    expect(trackLeadEvent).toHaveBeenCalledWith('lead_proposal_sent', {
      lead_id: '1',
      lead_name: 'Test Lead',
      previous_stage: 'Novo',
      new_stage_id: '3',
      lead_value: 0
    });
  });
});
