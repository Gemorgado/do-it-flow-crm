
import { supabase } from '../supabase/client';
import { SpaceBinding } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Helper functions to convert between database and domain models
const toDbBinding = (binding: SpaceBinding) => ({
  space_id: binding.spaceId,
  client_id: binding.clientId,
  contract_id: binding.contractId,
  start_date: binding.startDate,
  end_date: binding.endDate,
  notes: binding.notes,
  unit_price: binding.unitPrice
});

const fromDbBinding = (dbBinding: any): SpaceBinding => ({
  id: dbBinding.id,
  spaceId: dbBinding.space_id,
  clientId: dbBinding.client_id,
  contractId: dbBinding.contract_id,
  startDate: dbBinding.start_date,
  endDate: dbBinding.end_date,
  notes: dbBinding.notes,
  unitPrice: dbBinding.unit_price,
  boundAt: dbBinding.created_at // Use created_at as boundAt
});

export const bindingPersistence = {
  // List all space bindings
  listBindings: async (): Promise<SpaceBinding[]> => {
    const { data, error } = await supabase
      .from('space_allocations')
      .select('*');

    if (error) {
      console.error('Error fetching space bindings:', error);
      throw error;
    }

    return data.map(fromDbBinding);
  },

  // Bind a space to a client
  bindSpace: async (binding: SpaceBinding): Promise<SpaceBinding> => {
    const bindingId = binding.id || uuidv4();
    const bindingToInsert = {
      id: bindingId,
      ...toDbBinding(binding)
    };

    const { data, error } = await supabase
      .from('space_allocations')
      .insert(bindingToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error binding space:', error);
      throw error;
    }

    return fromDbBinding(data);
  },

  // Update a space binding
  updateBinding: async (binding: SpaceBinding): Promise<SpaceBinding> => {
    const { data, error } = await supabase
      .from('space_allocations')
      .update({
        client_id: binding.clientId,
        contract_id: binding.contractId,
        start_date: binding.startDate,
        end_date: binding.endDate,
        notes: binding.notes,
        unit_price: binding.unitPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', binding.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating space binding:', error);
      throw error;
    }

    return fromDbBinding(data);
  },

  // Unbind a space (delete binding)
  unbindSpace: async (spaceId: string): Promise<void> => {
    const { error } = await supabase
      .from('space_allocations')
      .delete()
      .eq('space_id', spaceId);

    if (error) {
      console.error('Error unbinding space:', error);
      throw error;
    }
  }
};
