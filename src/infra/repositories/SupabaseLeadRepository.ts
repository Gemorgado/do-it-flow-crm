
import { supabase } from '../../integrations/supabase/client';
import { Lead, NewLead } from '../../domain/models/Lead';
import { LeadRepository } from '../../domain/repositories/LeadRepository';
import { toDbLead, toDomainLead } from '../mappers/LeadMappers';

export class SupabaseLeadRepository implements LeadRepository {
  async list(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*, stage:pipeline_stages(*)')
      .neq('status', 'converted');

    if (error) throw error;
    return data.map(toDomainLead);
  }

  async get(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*, stage:pipeline_stages(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw error;
    }
    
    return toDomainLead(data);
  }

  async create(lead: NewLead): Promise<Lead> {
    const dbLead = toDbLead(lead);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(dbLead)
      .select('*, stage:pipeline_stages(*)')
      .single();

    if (error) throw error;
    return toDomainLead(data);
  }

  async update(lead: Lead): Promise<Lead> {
    const dbLead = toDbLead(lead);
    
    const { data, error } = await supabase
      .from('leads')
      .update({ 
        ...dbLead,
        updated_at: new Date().toISOString() 
      })
      .eq('id', lead.id)
      .select('*, stage:pipeline_stages(*)')
      .single();

    if (error) throw error;
    return toDomainLead(data);
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async markAsConverted(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({
        status: 'converted',
        stage_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async listByStage(stageId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*, stage:pipeline_stages(*)')
      .eq('stage_id', stageId);

    if (error) throw error;
    return data.map(toDomainLead);
  }
}
