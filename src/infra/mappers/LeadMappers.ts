
import { Lead, NewLead, LeadStatus, LeadSource, PipelineStage } from '../../domain/models/Lead';

// Define the database-specific source types
type DbLeadSource = 'site_organic' | 'google_ads' | 'meta_ads' | 'instagram' | 'referral' | 'in_person_visit' | 'events' | 'other';

// Define the database-specific status types
type DbLeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'closed_won' | 'closed_lost';

// Map domain LeadSource values to database values
const mapSourceToDB = (source: LeadSource): DbLeadSource => {
  const sourceMap: Record<LeadSource, DbLeadSource> = {
    'website_organic': 'site_organic',
    'google_ads': 'google_ads',
    'meta_ads': 'meta_ads',
    'instagram': 'instagram',
    'referral': 'referral',
    'in_person_visit': 'in_person_visit',
    'events': 'events',
    'other': 'other'
  };
  
  return sourceMap[source] || 'other';
};

// Map database source values to domain LeadSource
const mapSourceFromDB = (dbSource: string): LeadSource => {
  const sourceMap: Record<string, LeadSource> = {
    'site_organic': 'website_organic',
    'google_ads': 'google_ads',
    'meta_ads': 'meta_ads',
    'instagram': 'instagram',
    'referral': 'referral',
    'in_person_visit': 'in_person_visit',
    'events': 'events',
    'other': 'other'
  };
  
  return sourceMap[dbSource] || 'other';
};

// Map domain LeadStatus values to database values
const mapStatusToDB = (status: LeadStatus): DbLeadStatus => {
  const statusMap: Record<LeadStatus, DbLeadStatus> = {
    'new': 'new',
    'contacted': 'contacted',
    'qualified': 'qualified',
    'proposal': 'proposal',
    'negotiation': 'negotiation',
    'won': 'closed_won',
    'lost': 'closed_lost',
    'converted': 'converted'
  };
  
  return statusMap[status] || 'new';
};

// Map database status values to domain LeadStatus
const mapStatusFromDB = (dbStatus: string): LeadStatus => {
  const statusMap: Record<string, LeadStatus> = {
    'new': 'new',
    'contacted': 'contacted',
    'qualified': 'qualified',
    'proposal': 'proposal',
    'negotiation': 'negotiation',
    'closed_won': 'won',
    'closed_lost': 'lost',
    'converted': 'converted'
  };
  
  return statusMap[dbStatus] || 'new';
};

export const toDbLead = (lead: NewLead) => {
  return {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    status: mapStatusToDB(lead.status),
    source: mapSourceToDB(lead.source),
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
    status: mapStatusFromDB(dbLead.status),
    source: mapSourceFromDB(dbLead.source),
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
