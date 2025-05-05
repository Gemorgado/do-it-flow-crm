
export type LeadStatus = 
  | 'new'
  | 'contacted' 
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'won'
  | 'lost'
  | 'converted';

export type LeadSource = 
  | 'website_organic' 
  | 'google_ads' 
  | 'meta_ads' 
  | 'instagram' 
  | 'referral' 
  | 'in_person_visit' 
  | 'events' 
  | 'other';

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  sourceDetail?: string;
  createdAt: string;
  updatedAt: string;
  stageId: string;
  stage?: PipelineStage;
  assignedTo?: string;
  notes?: string;
  value?: number;
  lastContact?: string;
  nextFollowUp?: string;
  meetingScheduled?: string;
}

export interface NewLead extends Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
