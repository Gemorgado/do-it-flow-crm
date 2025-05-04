
import { useState, useEffect, useCallback } from 'react';
import { Client, Location, SpaceBinding } from '@/types';
import { useSpaceBindings, useBindSpace, useUnbindSpace } from './useSpaceBindings';
import { useClients } from './useClients';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useSpaceBinderManager = (space: Location, onClose: () => void) => {
  // State for managing client selection and binding
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contractId, setContractId] = useState<string | null>(null);
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [existingBinding, setExistingBinding] = useState<SpaceBinding | null>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const [activeContract, setActiveContract] = useState<any | null>(null);

  // Fetch space bindings
  const { data: bindings = [], isLoading: isLoadingBindings } = useSpaceBindings();
  const { data: clients = [], isLoading: isLoadingClients } = useClients();
  const bindSpace = useBindSpace();
  const unbindSpace = useUnbindSpace();

  // Find binding for this space if exists
  useEffect(() => {
    if (bindings.length > 0 && space) {
      const binding = bindings.find(b => b.spaceId === space.id);
      if (binding) {
        setExistingBinding(binding);
        setSelectedClientId(binding.clientId);
        setContractId(binding.contractId || null);
        setUnitPrice(binding.unitPrice || null);
        setStartDate(binding.startDate || null);
        setEndDate(binding.endDate || null);
      } else {
        // Reset if no binding found
        setExistingBinding(null);
        setSelectedClientId(null);
        setContractId(null);
        setUnitPrice(null);
        setStartDate(null);
        setEndDate(null);
      }
    }
  }, [bindings, space]);

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

    // If we have an existing binding, update it
    if (existingBinding) {
      const updatedBinding = {
        ...existingBinding,
        clientId: selectedClientId,
        contractId: contractId,
        unitPrice: unitPrice,
        startDate: startDate,
        endDate: endDate,
      };
      await bindSpace.mutateAsync(updatedBinding);
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
      await bindSpace.mutateAsync(newBinding);
    }
    onClose();
  }, [
    selectedClientId, 
    existingBinding, 
    space, 
    contractId, 
    unitPrice, 
    startDate, 
    endDate, 
    bindSpace,
    onClose
  ]);

  // Unbind the space
  const handleUnbind = useCallback(async () => {
    if (existingBinding && confirm('Are you sure you want to unbind this space?')) {
      await unbindSpace.mutateAsync(space.id);
      onClose();
    }
  }, [existingBinding, space.id, unbindSpace, onClose]);

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

  // Check if we can save
  const canSave = selectedClientId !== null;

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
    isLoadingContract,
    activeContract,
    handleSave,
    handleUnbind,
    bindSpace,
    unbindSpace,
    canSave
  };
};
