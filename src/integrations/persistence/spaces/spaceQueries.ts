
import { supabase } from '../../supabase/client';
import { Location } from '@/types';
import { fromDbSpace } from './spaceMappers';

/**
 * Get all spaces/locations
 */
export const getLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching spaces:', error);
    throw error;
  }

  return data.map(fromDbSpace);
};

/**
 * Get a single space/location by ID
 */
export const getLocation = async (id: string): Promise<Location | undefined> => {
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
};
