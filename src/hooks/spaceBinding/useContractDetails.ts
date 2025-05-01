
import { useState, useEffect } from "react";
import { useClientActiveContract } from "@/hooks/useClients";
import { SpaceBinding } from "@/types";

/**
 * Hook to manage contract details for space binding
 */
export function useContractDetails(
  selectedClientId: string | null,
  existingBinding: SpaceBinding | null
) {
  // Contract details state
  const [unitPrice, setUnitPrice] = useState<number | null>(
    existingBinding?.unitPrice || null
  );
  const [startDate, setStartDate] = useState<string | null>(
    existingBinding?.startDate || null
  );
  const [endDate, setEndDate] = useState<string | null>(
    existingBinding?.endDate || null
  );
  const [contractId, setContractId] = useState<string | null>(
    existingBinding?.contractId || null
  );
  
  // Get client's active contract
  const { data: activeContract, isLoading: isLoadingContract } = useClientActiveContract(selectedClientId);
  
  // Update contract details when active contract changes
  useEffect(() => {
    if (!activeContract) {
      // Don't reset if we have an existing binding
      if (!existingBinding) {
        setContractId(null);
        setUnitPrice(null);
        setStartDate(null);
        setEndDate(null);
      }
      return;
    }
    
    console.log("Setting contract details from active contract:", activeContract);
    setContractId(activeContract.id);
    setUnitPrice(activeContract.value);
    setStartDate(activeContract.contractStart);
    setEndDate(activeContract.contractEnd);
  }, [activeContract, existingBinding]);
  
  return {
    contractId,
    setContractId,
    unitPrice,
    setUnitPrice,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoadingContract,
    activeContract
  };
}
