
import { useState, useCallback } from 'react';
import { Location, Client } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { SpaceBinding } from '@/data/types'; // Use correct import

export const useSpaceBinderManager = (space: Location, onClose: () => void) => {
  // State for the form
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(false);
  
  // State for binding
  const [existingBinding, setExistingBinding] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Contract details
  const [contractId, setContractId] = useState<string>('');
  const [isLoadingContract, setIsLoadingContract] = useState<boolean>(false);
  const [activeContract, setActiveContract] = useState<any>(null);
  
  // Additional binding details
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');

  // Check if we can save the binding
  const canSave = selectedClientId !== '' && startDate !== '';

  // Load existing binding when space changes
  const loadExistingBinding = useCallback(async () => {
    if (!space) return;
    
    try {
      setIsLoading(true);
      const bindings = await persistence.listBindings();
      const binding = bindings.find(b => b.spaceId === space.id);
      
      if (binding) {
        setExistingBinding(binding);
        setSelectedClientId(binding.clientId);
        setStartDate(binding.startDate.split('T')[0]);
        setEndDate(binding.endDate ? binding.endDate.split('T')[0] : '');
        setUnitPrice(binding.unitPrice || 0);
        setContractId(binding.contractId || '');
        
        // Load client details if needed
        // (This would normally load contract details as well)
      }
    } catch (error) {
      console.error("Error loading space binding:", error);
      toast.error("Failed to load space details");
    } finally {
      setIsLoading(false);
    }
  }, [space]);

  // Handle saving the binding
  const handleSave = async () => {
    if (!canSave || !space) return;
    
    try {
      setIsLoading(true);
      
      const bindingData: SpaceBinding = {
        id: existingBinding?.id || uuidv4(), // Add required id
        spaceId: space.id,
        clientId: selectedClientId,
        contractId: contractId || null,
        startDate: startDate,
        endDate: endDate || null,
        boundAt: new Date().toISOString(),
        unitPrice: unitPrice || null,
        notes: `Space allocation for ${space.name}`,
      };
      
      if (existingBinding) {
        await persistence.updateBinding(bindingData);
        toast.success("Space allocation updated successfully");
      } else {
        await persistence.bindSpace(bindingData);
        toast.success("Space allocated successfully");
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving space binding:", error);
      toast.error("Failed to save space allocation");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing the binding
  const handleUnbind = async () => {
    if (!existingBinding || !space) return;
    
    try {
      setIsLoading(true);
      await persistence.unbindSpace(space.id);
      toast.success("Space allocation removed");
      onClose();
    } catch (error) {
      console.error("Error unbinding space:", error);
      toast.error("Failed to remove space allocation");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize
  useState(() => {
    loadExistingBinding();
  });

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
    canSave,
  };
};
