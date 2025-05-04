import { supabase } from '../supabase/client';
import { Lead, LeadStatus, LeadSource, PipelineStage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to map frontend status to database status
const mapLeadStatus = (status: LeadStatus): string => {
  const statusMap: Record<string, string> = {
    'novo': 'new',
    'contatado': 'contacted',
    'qualificado': 'qualified',
    'proposta': 'proposal',
    'negociação': 'negotiation',
    'fechado': 'closed_won',
    'perdido': 'closed_lost'
  };
  
  return statusMap[status] || 'new';
};

// Helper function to map frontend source to database source
const mapLeadSource = (source: LeadSource): string => {
  const sourceMap: Record<string, string> = {
    'site_organico': 'site_organic',
    'google_ads': 'google_ads',
    'meta_ads': 'meta_ads',
    'instagram': 'instagram',
    'indicacao': 'referral',
    'visita_presencial': 'in_person_visit',
    'eventos': 'events',
    'outros': 'other'
  };
  
  return sourceMap[source] || 'other';
};

export const leadPersistence = {
  listLeads: async (): Promise<Lead[]> => {
    const { data: stagesData, error: stagesError } = await supabase
      .from('pipeline_stages')
      .select('*')
      .order('order_number', { ascending: true });

    if (stagesError) {
      console.error('Error fetching pipeline stages:', stagesError);
      throw stagesError;
    }

    const stages: Record<string, PipelineStage> = {};
    stagesData.forEach(stage => {
      stages[stage.id] = {
        id: stage.id,
        name: stage.name,
        order: stage.order_number,
        color: stage.color
      };
    });

    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .neq('status', 'converted');

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw leadsError;
    }

    return leadsData.map(lead => ({
      id: lead.id,
      name: lead.name,
      company: lead.company || '',
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status as LeadStatus,
      source: lead.source as LeadSource,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
      stage: lead.stage_id ? stages[lead.stage_id] : null,
      assignedTo: lead.assigned_to || '',
      notes: lead.notes || '',
      value: lead.value || 0,
      lastContact: lead.last_contact,
      nextFollowUp: lead.next_follow_up,
      meetingScheduled: lead.meeting_scheduled
    }));
  },

  getLead: async (id: string): Promise<Lead | undefined> => {
    const { data: stagesData } = await supabase
      .from('pipeline_stages')
      .select('*');

    const stages: Record<string, PipelineStage> = {};
    stagesData?.forEach(stage => {
      stages[stage.id] = {
        id: stage.id,
        name: stage.name,
        order: stage.order_number,
        color: stage.color
      };
    });

    const { data: lead, error } = await supabase
      .from('leads')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return undefined;
      }
      console.error('Error fetching lead:', error);
      throw error;
    }

    return {
      id: lead.id,
      name: lead.name,
      company: lead.company || '',
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status as LeadStatus,
      source: lead.source as LeadSource,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
      stage: lead.stage_id ? stages[lead.stage_id] : null,
      assignedTo: lead.assigned_to || '',
      notes: lead.notes || '',
      value: lead.value || 0,
      lastContact: lead.last_contact,
      nextFollowUp: lead.next_follow_up,
      meetingScheduled: lead.meeting_scheduled
    };
  },
  
  createLead: async (lead: Lead): Promise<Lead> => {
    // Get the "New Leads" stage (first stage) if no stage provided
    let stageId = lead.stage?.id;
    
    if (!stageId) {
      const { data: firstStage } = await supabase
        .from('pipeline_stages')
        .select()
        .order('order_number', { ascending: true })
        .limit(1)
        .single();
      
      if (firstStage) {
        stageId = firstStage.id;
      }
    }

    const leadId = lead.id || uuidv4();
    
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: mapLeadStatus(lead.status),
        source: mapLeadSource(lead.source),
        stage_id: stageId,
        assigned_to: lead.assignedTo,
        notes: lead.notes,
        value: lead.value,
        last_contact: lead.lastContact,
        next_follow_up: lead.nextFollowUp,
        meeting_scheduled: lead.meetingScheduled,
        id: leadId // Include the ID at the end of the object
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    // Now get the stage details to return a complete lead object
    const { data: stage } = await supabase
      .from('pipeline_stages')
      .select()
      .eq('id', stageId)
      .single();

    return {
      ...lead,
      id: leadId,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      stage: stage ? {
        id: stage.id,
        name: stage.name,
        order: stage.order_number,
        color: stage.color
      } : null
    };
  },

  updateLead: async (lead: Lead): Promise<Lead> => {
    const { error } = await supabase
      .from('leads')
      .update({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: mapLeadStatus(lead.status),
        source: mapLeadSource(lead.source),
        stage_id: lead.stage?.id || null,
        assigned_to: lead.assignedTo,
        notes: lead.notes,
        value: lead.value,
        last_contact: lead.lastContact,
        next_follow_up: lead.nextFollowUp,
        meeting_scheduled: lead.meetingScheduled,
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id);

    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }

    return lead;
  },

  deleteLead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }
};
