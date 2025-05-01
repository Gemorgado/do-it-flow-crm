
import { useState, useEffect } from "react";
import { useClientActiveContract } from "@/hooks/useClients";

/**
 * Hook to handle client selection and manage contract details
 */
export function useClientContractSelection(initialClientId: string | null = null) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Contract details state
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  
  // Get client's active contract
  const { data: activeContract, isLoading: isLoadingContract } = useClientActiveContract(selectedClientId);
  
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
    isLoadingContract,
    activeContract
  };
}
