
import { supabase } from '../supabase/client';
import { Location } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from '@/types/service';

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
      type: space.type as ServiceType,
      description: space.description || '',
      floor: space.floor,
      area: space.area,
      capacity: space.capacity,
      isActive: space.is_active,
      createdAt: space.created_at,
      updatedAt: space.updated_at
    }));
  },

  getLocation: async (id: string): Promise<Location | undefined> => {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return undefined;
      }
      console.error('Error fetching space:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type as ServiceType,
      description: data.description || '',
      floor: data.floor,
      area: data.area,
      capacity: data.capacity,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  createSpace: async (space: Location): Promise<Location> => {
    const spaceId = space.id || uuidv4();

    const { error } = await supabase
      .from('spaces')
      .insert({
        id: spaceId,
        name: space.name,
        type: space.type as ServiceType,
        description: space.description,
        floor: space.floor,
        area: space.area,
        capacity: space.capacity,
        is_active: space.isActive !== false
      });

    if (error) {
      console.error('Error creating space:', error);
      throw error;
    }

    return {
      ...space,
      id: spaceId
    };
  },

  updateSpace: async (space: Location): Promise<Location> => {
    const { error } = await supabase
      .from('spaces')
      .update({
        name: space.name,
        type: space.type as ServiceType,
        description: space.description,
        floor: space.floor,
        area: space.area,
        capacity: space.capacity,
        is_active: space.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', space.id);

    if (error) {
      console.error('Error updating space:', error);
      throw error;
    }

    return space;
  },

  deleteSpace: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting space:', error);
      throw error;
    }
  }
};
