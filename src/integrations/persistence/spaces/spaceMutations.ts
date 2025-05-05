
import { supabase } from '../../supabase/client';
import { Location } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toDbSpace, fromDbSpace } from './spaceMappers';

/**
 * Create a new space/location
 */
export const createSpace = async (space: Location): Promise<Location> => {
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
};

/**
 * Update an existing space/location
 */
export const updateSpace = async (space: Location): Promise<Location> => {
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
};

/**
 * Delete a space/location by ID
 */
export const deleteSpace = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('spaces')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting space:', error);
    throw error;
  }
};
