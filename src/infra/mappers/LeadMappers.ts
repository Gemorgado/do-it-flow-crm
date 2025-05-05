
import { Lead, NewLead, LeadStatus, LeadSource, PipelineStage } from '../../domain/models/Lead';

export const toDbLead = (lead: NewLead) => {
  return {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    source: lead.source,
    source_detail: lead.sourceDetail,
    stage_id: lead.stageId,
    assigned_to: lead.assignedTo,
    notes: lead.notes,
    value: lead.value,
    last_contact: lead.lastContact,
    next_follow_up: lead.nextFollowUp,
    meeting_scheduled: lead.meetingScheduled
  };
};

export const toDomainLead = (dbLead: any): Lead => {
  const lead: Lead = {
    id: dbLead.id,
    name: dbLead.name,
    company: dbLead.company || '',
    email: dbLead.email,
    phone: dbLead.phone || '',
    status: dbLead.status as LeadStatus,
    source: dbLead.source as LeadSource,
    sourceDetail: dbLead.source_detail,
    createdAt: dbLead.created_at,
    updatedAt: dbLead.updated_at,
    stageId: dbLead.stage_id,
    assignedTo: dbLead.assigned_to,
    notes: dbLead.notes,
    value: dbLead.value,
    lastContact: dbLead.last_contact,
    nextFollowUp: dbLead.next_follow_up,
    meetingScheduled: dbLead.meeting_scheduled
  };

  if (dbLead.stage) {
    lead.stage = {
      id: dbLead.stage.id,
      name: dbLead.stage.name,
      order: dbLead.stage.order_number,
      color: dbLead.stage.color
    };
  }

  return lead;
};
