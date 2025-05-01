
import { useState } from "react";
import { Location, SpaceBinding } from "@/types";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useClientContractSelection } from "@/hooks/useClientContractSelection";
import { useSpaceBindingForm } from "@/hooks/useSpaceBindingForm";

/**
 * Unified hook that combines all space binding functionality
 */
export function useSpaceBindingManager(space: Location | null, onClose: () => void) {
  // Get existing bindings
  const { data: bindings = [] } = useSpaceBindings();
  
  // Find existing binding for this space
  const existingBinding = space ? bindings.find(b => b.spaceId === space.id) : null;
  
  // Use the client selection hook with initial client from binding
  const {
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    contractId,
    unitPrice,
    setUnitPrice,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoadingContract,
    activeContract
  } = useClientContractSelection(existingBinding?.clientId || null);
  
  // Use the form submission hook
  const {
    handleSave,
    handleUnbind,
    bindSpace,
    unbindSpace,
    canSave
  } = useSpaceBindingForm({
    space,
    selectedClientId,
    contractId,
    unitPrice,
    startDate,
    endDate,
    onClose
  });
  
  return {
    // Client selection
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    
    // Contract details
    contractId,
    unitPrice,
    setUnitPrice,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    // Status
    existingBinding,
    isLoadingContract,
    activeContract,
    canSave,
    
    // Actions
    handleSave,
    handleUnbind,
    bindSpace,
    unbindSpace
  };
}
