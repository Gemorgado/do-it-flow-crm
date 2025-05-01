
import { useState } from "react";
import { Location } from "@/types";
import { useClientSelection } from "./spaceBinding/useClientSelection";
import { useContractDetails } from "./spaceBinding/useContractDetails";
import { useSpaceBindingActions } from "./spaceBinding/useSpaceBindingActions";
import { useSpaceBindings } from "./useSpaceBindings";

/**
 * Unified hook that combines all space binding functionality
 */
export function useSpaceBindingManager(space: Location | null, onClose: () => void) {
  // Get existing bindings
  const { data: bindings = [] } = useSpaceBindings();
  
  // Find existing binding for this space
  const existingBinding = space ? bindings.find(b => b.spaceId === space.id) : null;
  
  // Use the client selection hook with initial client from binding
  const clientSelectionProps = useClientSelection(existingBinding?.clientId || null);
  
  // Use the contract details hook
  const contractDetailsProps = useContractDetails(
    clientSelectionProps.selectedClientId,
    existingBinding
  );
  
  // Use the actions hook
  const actionProps = useSpaceBindingActions({
    space,
    selectedClientId: clientSelectionProps.selectedClientId,
    contractId: contractDetailsProps.contractId,
    unitPrice: contractDetailsProps.unitPrice,
    startDate: contractDetailsProps.startDate,
    endDate: contractDetailsProps.endDate,
    onClose
  });
  
  return {
    // Client selection props
    ...clientSelectionProps,
    
    // Contract details props
    ...contractDetailsProps,
    
    // Action props
    ...actionProps,
    
    // Binding status
    existingBinding,
  };
}
