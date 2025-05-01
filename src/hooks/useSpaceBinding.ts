
import { useState, useEffect } from "react";
import { useClientActiveContract } from "@/hooks/useClients";
import { useSpaceBindings, useBindSpace, useUnbindSpace } from "@/hooks/useSpaceBindings";
import { Location, SpaceBinding } from "@/types";
import { toast } from "sonner";

export function useSpaceBinding(space: Location | null, onClose: () => void) {
  // State for client selection and search
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Contract details state
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  
  // Get existing bindings and client's contract
  const { data: bindings = [] } = useSpaceBindings();
  const { data: activeContract, isLoading: isLoadingContract } = useClientActiveContract(selectedClientId);
  
  // Get mutation functions for binding/unbinding spaces
  const bindSpace = useBindSpace();
  const unbindSpace = useUnbindSpace();
  
  // Check if this space is already bound
  const existingBinding = space ? bindings.find(b => b.spaceId === space.id) : null;
  
  // Reset form when modal opens/closes or space changes
  useEffect(() => {
    if (existingBinding) {
      setSelectedClientId(existingBinding.clientId);
      setContractId(existingBinding.contractId);
      setUnitPrice(existingBinding.unitPrice || null);
      setStartDate(existingBinding.startDate || null);
      setEndDate(existingBinding.endDate || null);
      console.log("Loading existing binding:", existingBinding);
    } else {
      // Only reset if there's a space (prevents unnecessary resets during initialization)
      if (space) {
        console.log("Resetting form - no existing binding");
        setSelectedClientId(null);
        setContractId(null);
        setUnitPrice(null);
        setStartDate(null);
        setEndDate(null);
      }
    }
  }, [existingBinding, space]);
  
  // Update contract details when active contract changes
  useEffect(() => {
    if (!activeContract) {
      setContractId(null);
      setUnitPrice(null);
      setStartDate(null);
      setEndDate(null);
      return;
    }
    
    console.log("Setting contract details from active contract:", activeContract);
    setContractId(activeContract.id);
    setUnitPrice(activeContract.value);
    setStartDate(activeContract.contractStart);
    setEndDate(activeContract.contractEnd);
  }, [activeContract]);
  
  // Handle binding the space
  const handleSave = () => {
    if (!space) {
      toast.error("Erro", {
        description: "Nenhum espaço selecionado"
      });
      return;
    }
    
    if (!selectedClientId) {
      toast.error("Dados incompletos", {
        description: "Selecione um cliente para vincular o espaço"
      });
      return;
    }
    
    if (!contractId) {
      toast.error("Dados incompletos", {
        description: "Cliente não possui contrato ativo"
      });
      return;
    }
    
    const binding: SpaceBinding = {
      spaceId: space.id,
      clientId: selectedClientId,
      contractId: contractId,
      boundAt: new Date().toISOString(),
      unitPrice,
      startDate,
      endDate
    };
    
    console.log("Saving binding:", binding);
    bindSpace.mutate(binding);
    onClose();
  };
  
  // Handle unbinding the space
  const handleUnbind = () => {
    if (!space) return;
    unbindSpace.mutate(space.id);
    onClose();
  };

  return {
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    contractId,
    unitPrice,
    startDate,
    endDate,
    existingBinding,
    isLoadingContract,
    activeContract,
    handleSave,
    handleUnbind,
    bindSpace,
    unbindSpace
  };
}
