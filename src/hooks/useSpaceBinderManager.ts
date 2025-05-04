
import { useState, useEffect, useCallback } from 'react';
import { Client, Location, SpaceBinding } from '@/types';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// This hook is used specifically for managing a single space binding
export const useSpaceBinderManager = (space: Location, onClose: () => void) => {
  // State for managing client selection and binding
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contractId, setContractId] = useState<string | null>(null);
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [existingBinding, setExistingBinding] = useState<SpaceBinding | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const [activeContract, setActiveContract] = useState<any | null>(null);

  // Load clients for selection
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const clientsData = await persistence.listClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setIsLoadingClients(false);
      }
    };
    
    fetchClients();
  }, []);

  // Load existing binding for this space if it exists
  useEffect(() => {
    const fetchBinding = async () => {
      setIsLoading(true);
      try {
        const bindings = await persistence.listBindings();
        const binding = bindings.find(b => b.spaceId === space.id);
        if (binding) {
          setExistingBinding(binding);
          setSelectedClientId(binding.clientId);
          setContractId(binding.contractId || null);
          setUnitPrice(binding.unitPrice || null);
          setStartDate(binding.startDate || null);
          setEndDate(binding.endDate || null);
        }
      } catch (error) {
        console.error('Error fetching space binding:', error);
        toast.error('Failed to load space binding');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBinding();
  }, [space.id]);

  // Get active client contracts when client is selected
  useEffect(() => {
    if (selectedClientId) {
      setIsLoadingContract(true);
      const client = clients.find(c => c.id === selectedClientId);
      if (client && client.services?.length > 0) {
        const activeServices = client.services.filter(s => s.status === 'ativo');
        if (activeServices.length > 0) {
          setActiveContract(activeServices[0]);
        } else {
          setActiveContract(null);
        }
      } else {
        setActiveContract(null);
      }
      setIsLoadingContract(false);
    }
  }, [selectedClientId, clients]);

  // Save the space binding
  const handleSave = useCallback(async () => {
    if (!selectedClientId) {
      toast.error('Please select a client');
      return;
    }

    if (!startDate) {
      toast.error('Start date is required');
      return;
    }

    try {
      // If we have an existing binding, update it
      if (existingBinding) {
        const updatedBinding: SpaceBinding = {
          ...existingBinding,
          clientId: selectedClientId,
          contractId: contractId,
          unitPrice: unitPrice,
          startDate: startDate,
          endDate: endDate,
        };
        await persistence.updateBinding(updatedBinding);
        toast.success('Space binding updated');
      } else {
        // Create new binding
        const newBinding: SpaceBinding = {
          id: uuidv4(),
          spaceId: space.id,
          clientId: selectedClientId,
          contractId: contractId,
          startDate: startDate || new Date().toISOString(),
          endDate: endDate,
          unitPrice: unitPrice,
          boundAt: new Date().toISOString(), // Add the required boundAt property
        };
        await persistence.bindSpace(newBinding);
        toast.success('Space bound to client');
      }
      onClose();
    } catch (error) {
      console.error('Error saving space binding:', error);
      toast.error('Failed to save space binding');
    }
  }, [
    selectedClientId, 
    existingBinding, 
    space, 
    contractId, 
    unitPrice, 
    startDate, 
    endDate,
    onClose
  ]);

  // Unbind the space
  const handleUnbind = useCallback(async () => {
    if (existingBinding && confirm('Are you sure you want to unbind this space?')) {
      try {
        await persistence.unbindSpace(space.id);
        toast.success('Space unbound');
        onClose();
      } catch (error) {
        console.error('Error unbinding space:', error);
        toast.error('Failed to unbind space');
      }
    }
  }, [existingBinding, space.id, onClose]);

  // Check if we can save
  const canSave = selectedClientId !== null && startDate !== null;

  return {
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    contractId,
    setContractId,
    unitPrice,
    setUnitPrice,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    existingBinding,
    isLoading,
    isLoadingClients,
    isLoadingContract,
    activeContract,
    clients,
    handleSave,
    handleUnbind,
    canSave
  };
};
