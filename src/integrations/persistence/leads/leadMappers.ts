
import { Lead, LeadSource, LeadStatus, PipelineStage } from '@/types';
import { supabase } from '../../supabase/client';
import { toLeadSource, toLeadStatus } from '@/utils/enumMappers';

// Map a lead object from the database to our domain model
export const mapLeadFromDatabase = (data: any, stage?: PipelineStage): Lead => {
  return {
    id: data.id,
    name: data.name || 'No Name',
    company: data.company || '',
    email: data.email || '',
    phone: data.phone || '',
    status: toLeadStatus(data.status) as LeadStatus,
    source: toLeadSource(data.source) as LeadSource,
    sourceDetail: data.source_detail || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    assignedTo: data.assigned_to,
    value: data.value || 0,
    notes: data.notes || '',
    lastContact: data.last_contact,
    nextFollowUp: data.next_follow_up,
    meetingScheduled: data.meeting_scheduled,
    stage: stage || {
      id: data.stage_id || '1',
      name: 'New',
      order: 1,
      color: '#3b82f6'
    },
  };
};

// Map a lead object to the database structure
export const mapLeadToDatabase = (lead: Lead): any => {
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
    value: lead.value,
    notes: lead.notes,
    last_contact: lead.lastContact,
    next_follow_up: lead.nextFollowUp,
    meeting_scheduled: lead.meetingScheduled,
  };
};

// Convert lead source to database acceptable values
export const mapLeadSourceToDb = (source: LeadSource | string): string => {
  const sourceMap: Record<string, string> = {
    'site_organico': 'site_organic',
    'indicacao': 'referral',
    'visita_presencial': 'in_person_visit',
    'eventos': 'events',
    'outros': 'other'
  };
  
  return sourceMap[source as string] || source;
};

// Convert lead status to database acceptable values
export const mapLeadStatusToDb = (status: LeadStatus | string): string => {
  const statusMap: Record<string, string> = {
    'novo': 'new',
    'contatado': 'contacted',
    'qualificado': 'qualified',
    'proposta': 'proposal',
    'negociação': 'negotiation',
    'fechado': 'closed_won',
    'perdido': 'closed_lost'
  };
  
  return statusMap[status as string] || status;
};

// Get pipeline stage by ID
export const getPipelineStage = async (stageId: string): Promise<PipelineStage | undefined> => {
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
