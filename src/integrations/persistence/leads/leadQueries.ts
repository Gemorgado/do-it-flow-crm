
import { Lead, PipelineStage } from '@/types';
import { supabase } from '../../supabase/client';
import { mapLeadFromDatabase, getPipelineStage } from './leadMappers';
import { v4 as uuidv4 } from 'uuid';

// List all leads
export const listLeads = async (): Promise<Lead[]> => {
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
};

// Get a single lead by ID
export const getLead = async (id: string): Promise<Lead | undefined> => {
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
};
