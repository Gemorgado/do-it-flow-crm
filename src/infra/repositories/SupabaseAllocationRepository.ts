
import { supabase } from '../../integrations/supabase/client';
import { SpaceAllocation, NewSpaceAllocation } from '../../domain/models/Allocation';
import { AllocationRepository } from '../../domain/repositories/AllocationRepository';
import { toDbAllocation, toDomainAllocation } from '../mappers/AllocationMappers';

export class SupabaseAllocationRepository implements AllocationRepository {
  async list(): Promise<SpaceAllocation[]> {
    const { data, error } = await supabase
      .from('space_allocations')
      .select('*');

    if (error) throw error;
    return data.map(toDomainAllocation);
  }

  async getByClient(clientId: string): Promise<SpaceAllocation[]> {
    const { data, error } = await supabase
      .from('space_allocations')
      .select('*')
      .eq('client_id', clientId);

    if (error) throw error;
    return data.map(toDomainAllocation);
  }

  async getBySpace(spaceId: string): Promise<SpaceAllocation[]> {
    const { data, error } = await supabase
      .from('space_allocations')
      .select('*')
      .eq('space_id', spaceId);

    if (error) throw error;
    return data.map(toDomainAllocation);
  }

  async create(allocation: NewSpaceAllocation): Promise<SpaceAllocation> {
    const dbAllocation = toDbAllocation(allocation);
    
    const { data, error } = await supabase
      .from('space_allocations')
      .insert(dbAllocation)
      .select()
      .single();

    if (error) throw error;
    return toDomainAllocation(data);
  }

  async update(allocation: SpaceAllocation): Promise<SpaceAllocation> {
    const { data, error } = await supabase
      .from('space_allocations')
      .update({
        ...toDbAllocation(allocation),
        updated_at: new Date().toISOString()
      })
      .eq('id', allocation.id)
      .select()
      .single();

    if (error) throw error;
    return toDomainAllocation(data);
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('space_allocations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
