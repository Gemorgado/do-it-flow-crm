
import { supabase } from '../supabase/client';
import { SpaceBinding } from '@/types';
import { v4 as uuidv4 } from 'uuid';

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

    return data.map(binding => ({
      id: binding.id,
      spaceId: binding.space_id,
      clientId: binding.client_id,
      contractId: binding.contract_id,
      startDate: binding.start_date,
      endDate: binding.end_date,
      notes: binding.notes,
      unitPrice: binding.unit_price,
      boundAt: binding.created_at // Use created_at as boundAt
    }));
  },

  // Bind a space to a client
  bindSpace: async (binding: SpaceBinding): Promise<void> => {
    const bindingId = binding.id || uuidv4();

    const { error } = await supabase
      .from('space_allocations')
      .insert({
        id: bindingId,
        space_id: binding.spaceId,
        client_id: binding.clientId,
        contract_id: binding.contractId,
        start_date: binding.startDate,
        end_date: binding.endDate,
        notes: binding.notes,
        unit_price: binding.unitPrice
      });

    if (error) {
      console.error('Error binding space:', error);
      throw error;
    }
  },

  // Update a space binding
  updateBinding: async (binding: SpaceBinding): Promise<void> => {
    const { error } = await supabase
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
      .eq('id', binding.id);

    if (error) {
      console.error('Error updating space binding:', error);
      throw error;
    }
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
