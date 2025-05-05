
import { Lead, LeadStatus, LeadSource } from '@/types';
import { supabase } from '../../supabase/client';
import { mapLeadToDatabase, mapLeadSourceToDb, mapLeadStatusToDb } from './leadMappers';
import { v4 as uuidv4 } from 'uuid';
import { toLeadSource, toLeadStatus } from '@/utils/enumMappers';

// Create a new lead
export const createLead = async (lead: Lead): Promise<Lead> => {
  const leadId = lead.id || uuidv4();
  const leadToInsert = {
    ...mapLeadToDatabase(lead),
    id: leadId
  };
  
  // Make sure we're using supported enum values for source and status
  leadToInsert.source = mapLeadSourceToDb(lead.source);
  leadToInsert.status = mapLeadStatusToDb(lead.status);
  
  delete leadToInsert.stage_id; // Remove stage_id to avoid issues if it's null
  
  if (lead.stage?.id) {
    leadToInsert.stage_id = lead.stage.id;
  }
  
  const { error } = await supabase
    .from('leads')
    .insert(leadToInsert);
  
  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
  
  return {
    ...lead,
    id: leadId
  };
};

// Update an existing lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  const leadToUpdate = mapLeadToDatabase(lead);
  
  // Make sure we're using supported enum values for source and status
  leadToUpdate.source = mapLeadSourceToDb(lead.source);
  leadToUpdate.status = mapLeadStatusToDb(lead.status);
  
  const { error } = await supabase
    .from('leads')
    .update({
      ...leadToUpdate,
      updated_at: new Date().toISOString()
    })
    .eq('id', lead.id);
  
  if (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
  
  return lead;
};

// Delete a lead
export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};

// Create multiple leads at once (used for importing)
export const createLeads = async (leads: Lead[]): Promise<void> => {
  if (!leads.length) return;
  
  // Process each lead individually to ensure proper formatting
  for (const lead of leads) {
    try {
      await createLead(lead);
    } catch (error) {
      console.error(`Error creating lead ${lead.name}:`, error);
    }
  }
};
