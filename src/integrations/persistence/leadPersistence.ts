
import { supabase } from '../supabase/client';
import { Lead, LeadSource, LeadStatus, PipelineStage } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toLeadSource, toLeadStatus } from '@/utils/enumMappers';

// Helper function to map from database representation to app representation
const mapLeadFromDatabase = (
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
const mapLeadToDatabase = (lead: Lead) => {
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
const getPipelineStage = async (stageId: string): Promise<PipelineStage | undefined> => {
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

export const leadPersistence = {
  // List all leads
  listLeads: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
    
    // Get pipeline stages for all leads
    const stageIds = data
      .filter(lead => lead.stage_id)
      .map(lead => lead.stage_id);
    
    const uniqueStageIds = [...new Set(stageIds)];
    
    let stagesMap: Record<string, PipelineStage> = {};
    
    if (uniqueStageIds.length > 0) {
      const { data: stagesData, error: stagesError } = await supabase
        .from('pipeline_stages')
        .select('*')
        .in('id', uniqueStageIds);
      
      if (stagesError) {
        console.error('Error fetching pipeline stages:', stagesError);
      } else if (stagesData) {
        stagesMap = stagesData.reduce((map, stage) => {
          map[stage.id] = {
            id: stage.id,
            name: stage.name,
            order: stage.order_number,
            color: stage.color
          };
          return map;
        }, {} as Record<string, PipelineStage>);
      }
    }
    
    return data.map(lead => mapLeadFromDatabase(lead, stagesMap[lead.stage_id]));
  },
  
  // Get a single lead by ID
  getLead: async (id: string): Promise<Lead | undefined> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return undefined;
      }
      console.error('Error fetching lead:', error);
      throw error;
    }
    
    let stage: PipelineStage | undefined;
    if (data.stage_id) {
      stage = await getPipelineStage(data.stage_id);
    }
    
    return mapLeadFromDatabase(data, stage);
  },
  
  // Create a new lead
  createLead: async (lead: Lead): Promise<Lead> => {
    const leadId = lead.id || uuidv4();
    
    const { error } = await supabase
      .from('leads')
      .insert({
        id: leadId,
        ...mapLeadToDatabase(lead)
      });
    
    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
    
    return {
      ...lead,
      id: leadId
    };
  },
  
  // Update an existing lead
  updateLead: async (lead: Lead): Promise<Lead> => {
    const { error } = await supabase
      .from('leads')
      .update({
        ...mapLeadToDatabase(lead),
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id);
    
    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
    
    return lead;
  },
  
  // Delete a lead
  deleteLead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Create multiple leads at once (used for importing)
  createLeads: async (leads: Lead[]): Promise<void> => {
    if (!leads.length) return;
    
    // Convert leads to the format required by the database
    const dbLeads = leads.map(lead => mapLeadToDatabase(lead));
    
    const { error } = await supabase
      .from('leads')
      .insert(dbLeads);
    
    if (error) {
      console.error('Error creating multiple leads:', error);
      throw error;
    }
  }
};
