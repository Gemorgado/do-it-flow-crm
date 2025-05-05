
import { Lead, LeadSource, LeadStatus, PipelineStage } from '@/types';
import { supabase } from '../../supabase/client';
import { toLeadSource, toLeadStatus } from '@/utils/enumMappers';

// Helper function to map from database representation to app representation
export const mapLeadFromDatabase = (
  lead: any, 
  stage?: PipelineStage
): Lead => {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company || undefined,
    email: lead.email,
    phone: lead.phone || '',
    status: toLeadStatus(lead.status) as LeadStatus,
    source: toLeadSource(lead.source) as LeadSource,
    sourceDetail: lead.source_detail,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
    stage: stage || {
      id: lead.stage_id || '',
      name: '',
      order: 0,
      color: ''
    },
    assignedTo: lead.assigned_to,
    notes: lead.notes,
    value: lead.value,
    lastContact: lead.last_contact,
    nextFollowUp: lead.next_follow_up,
    meetingScheduled: lead.meeting_scheduled
  };
};

// Helper to convert from domain model to database model
export const mapLeadToDatabase = (lead: Lead) => {
  return {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    source: lead.source,
    source_detail: lead.sourceDetail,
    stage_id: lead.stage?.id,
    assigned_to: lead.assignedTo,
    notes: lead.notes,
    value: lead.value,
    last_contact: lead.lastContact,
    next_follow_up: lead.nextFollowUp,
    meeting_scheduled: lead.meetingScheduled
  };
};

// Helper function to get pipeline stage details
export const getPipelineStage = async (stageId: string): Promise<PipelineStage | undefined> => {
  if (!stageId) return undefined;
  
  const { data, error } = await supabase
    .from('pipeline_stages')
    .select('*')
    .eq('id', stageId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching pipeline stage:', error);
    return undefined;
  }
  
  return {
    id: data.id,
    name: data.name,
    order: data.order_number,
    color: data.color
  };
};
