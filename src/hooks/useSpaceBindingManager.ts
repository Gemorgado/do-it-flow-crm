
import { useState, useCallback, useEffect } from 'react';
import { persistence } from '@/integrations/persistence';
import { Client, ClientService, Location, SpaceBinding } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useSpaceBindingManager = (initialBindings: SpaceBinding[] = []) => {
  const [spaces, setSpaces] = useState<Location[]>([]);
  const [bindings, setBindings] = useState<SpaceBinding[]>(initialBindings);
  const [isLoading, setIsLoading] = useState(true);

  // Load spaces and existing bindings
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch spaces
        const spacesData = await persistence.getLocations();
        setSpaces(spacesData);

        // Fetch space bindings
        const bindingsData = await persistence.listBindings();
        setBindings(bindingsData);
      } catch (error) {
        console.error('Error fetching space data:', error);
        toast.error('Failed to load space data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Subscribe to realtime changes
    const spacesChannel = supabase.channel('spaces_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'spaces' },
        payload => {
          console.log('Space change received:', payload);
          // Reload data
          fetchData();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'space_allocations' },
        payload => {
          console.log('Space allocation change received:', payload);
          // Reload data
          fetchData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(spacesChannel);
    };
  }, []);

  // Check if a space is allocated
  const isSpaceAllocated = useCallback(
    (spaceId: string): boolean => {
      return bindings.some(binding => binding.spaceId === spaceId);
    },
    [bindings]
  );

  // Get binding for a space
  const getSpaceBinding = useCallback(
    (spaceId: string): SpaceBinding | undefined => {
      return bindings.find(binding => binding.spaceId === spaceId);
    },
    [bindings]
  );

  // Allocate space to a client
  const allocateSpace = useCallback(
    async (space: Location, client: Client, service: ClientService): Promise<boolean> => {
      try {
        if (isSpaceAllocated(space.id)) {
          toast.error('This space is already allocated');
          return false;
        }

        const newBinding: SpaceBinding = {
          id: uuidv4(),
          spaceId: space.id,
          clientId: client.id,
          contractId: service.id,
          startDate: service.contractStart,
          endDate: service.contractEnd,
          notes: ''
        };

        await persistence.bindSpace(newBinding);
        
        // No need to update local state as the realtime subscription will handle it
        toast.success('Space allocated successfully');
        return true;
      } catch (error) {
        console.error('Error allocating space:', error);
        toast.error('Failed to allocate space');
        return false;
      }
    },
    [isSpaceAllocated]
  );

  // Deallocate space
  const deallocateSpace = useCallback(
    async (spaceId: string): Promise<boolean> => {
      try {
        const binding = getSpaceBinding(spaceId);
        
        if (!binding) {
          toast.error('This space is not allocated');
          return false;
        }

        await persistence.unbindSpace(spaceId);
        
        // No need to update local state as the realtime subscription will handle it
        toast.success('Space deallocated successfully');
        return true;
      } catch (error) {
        console.error('Error deallocating space:', error);
        toast.error('Failed to deallocate space');
        return false;
      }
    },
    [getSpaceBinding]
  );

  // Update binding
  const updateSpaceBinding = useCallback(
    async (binding: SpaceBinding): Promise<boolean> => {
      try {
        await persistence.updateBinding(binding);
        
        // No need to update local state as the realtime subscription will handle it
        toast.success('Space allocation updated successfully');
        return true;
      } catch (error) {
        console.error('Error updating space binding:', error);
        toast.error('Failed to update space allocation');
        return false;
      }
    },
    []
  );

  // Get available spaces (not allocated)
  const getAvailableSpaces = useCallback(
    (): Location[] => {
      return spaces.filter(space => !isSpaceAllocated(space.id));
    },
    [spaces, isSpaceAllocated]
  );

  return {
    spaces,
    bindings,
    isLoading,
    isSpaceAllocated,
    getSpaceBinding,
    allocateSpace,
    deallocateSpace,
    updateSpaceBinding,
    getAvailableSpaces
  };
};
