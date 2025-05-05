
import { supabase } from '../supabase/client';
import { Location } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from '@/types/service';
import { toServiceType } from '@/utils/enumMappers';

// Helper function to convert domain model to database model
const toDbSpace = (space: Location) => ({
  name: space.name,
  type: space.type as ServiceType,
  description: space.description,
  floor: space.floor,
  area: space.area,
  capacity: space.capacity,
  is_active: space.isActive !== false
});

// Helper function to convert database model to domain model
const fromDbSpace = (dbSpace: any): Location => ({
  id: dbSpace.id,
  name: dbSpace.name,
  type: toServiceType(dbSpace.type),
  description: dbSpace.description || '',
  floor: dbSpace.floor,
  area: dbSpace.area,
  capacity: dbSpace.capacity,
  isActive: dbSpace.is_active,
  createdAt: dbSpace.created_at,
  updatedAt: dbSpace.updated_at
});

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

    return data.map(fromDbSpace);
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

    return fromDbSpace(data);
  },

  createSpace: async (space: Location): Promise<Location> => {
    const spaceId = space.id || uuidv4();

    const { data, error } = await supabase
      .from('spaces')
      .insert({
        id: spaceId,
        ...toDbSpace(space)
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating space:', error);
      throw error;
    }

    return fromDbSpace(data);
  },

  updateSpace: async (space: Location): Promise<Location> => {
    const { data, error } = await supabase
      .from('spaces')
      .update({
        ...toDbSpace(space),
        updated_at: new Date().toISOString()
      })
      .eq('id', space.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating space:', error);
      throw error;
    }

    return fromDbSpace(data);
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
