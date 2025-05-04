
import { supabase } from '../supabase/client';
import { Location, SpaceBinding } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const spacePersistence = {
  getLocations: async (): Promise<Location[]> => {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching spaces:', error);
      throw error;
    }

    return data.map(space => ({
      id: space.id,
      name: space.name,
      type: space.type,
      floor: space.floor || 1,
      capacity: space.capacity || null,
      area: space.area || null,
      description: space.description || '',
      isActive: space.is_active,
      createdAt: space.created_at,
      updatedAt: space.updated_at
    }));
  },

  updateSpace: async (space: Location): Promise<Location> => {
    const { data, error } = await supabase
      .from('spaces')
      .update({
        name: space.name,
        type: space.type,
        floor: space.floor,
        capacity: space.capacity,
        area: space.area,
        description: space.description,
        is_active: space.isActive !== false,
        updated_at: new Date().toISOString()
      })
      .eq('id', space.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating space:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      floor: data.floor || 1,
      capacity: data.capacity,
      area: data.area,
      description: data.description || '',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Space bindings methods (allocations)
  listBindings: async (): Promise<SpaceBinding[]> => {
    const { data, error } = await supabase
      .from('space_allocations')
      .select(`
        *,
        spaces:space_id(*),
        clients:client_id(*)
      `);

    if (error) {
      console.error('Error fetching space allocations:', error);
      throw error;
    }

    return data.map(allocation => ({
      id: allocation.id,
      spaceId: allocation.space_id,
      clientId: allocation.client_id,
      contractId: allocation.contract_id,
      startDate: allocation.start_date,
      endDate: allocation.end_date,
      notes: allocation.notes,
      space: allocation.spaces ? {
        id: allocation.spaces.id,
        name: allocation.spaces.name,
        type: allocation.spaces.type,
        floor: allocation.spaces.floor || 1,
        capacity: allocation.spaces.capacity,
        area: allocation.spaces.area,
        description: allocation.spaces.description || '',
        isActive: allocation.spaces.is_active,
        createdAt: allocation.spaces.created_at,
        updatedAt: allocation.spaces.updated_at
      } : null,
      client: allocation.clients ? {
        id: allocation.clients.id,
        name: allocation.clients.name,
        email: allocation.clients.email,
        services: []  // We don't fetch services here for simplicity
      } : null
    }));
  },

  bindSpace: async (binding: SpaceBinding): Promise<SpaceBinding> => {
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
        notes: binding.notes
      });

    if (error) {
      console.error('Error creating space binding:', error);
      throw error;
    }

    return {
      ...binding,
      id: bindingId
    };
  },

  updateBinding: async (binding: SpaceBinding): Promise<SpaceBinding> => {
    const { error } = await supabase
      .from('space_allocations')
      .update({
        space_id: binding.spaceId,
        client_id: binding.clientId,
        contract_id: binding.contractId,
        start_date: binding.startDate,
        end_date: binding.endDate,
        notes: binding.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', binding.id);

    if (error) {
      console.error('Error updating space binding:', error);
      throw error;
    }

    return binding;
  },

  unbindSpace: async (spaceId: string): Promise<void> => {
    const { error } = await supabase
      .from('space_allocations')
      .delete()
      .eq('space_id', spaceId);

    if (error) {
      console.error('Error deleting space binding:', error);
      throw error;
    }
  }
};
