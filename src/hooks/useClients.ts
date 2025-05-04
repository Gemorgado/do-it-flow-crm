
import { useQuery } from "@tanstack/react-query";
import { clients, clientServices } from "@/data/clientsData";
import { Client, ClientService } from "@/types";

/**
 * Hook to get all clients
 * @returns Query with clients data
 */
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      // In a real app, this would be an API call
      return clients;
    }
  });
}

/**
 * Hook to get contracts for a specific client
 * @param clientId - Client ID to filter contracts
 * @returns Query with client's contracts
 */
export function useClientContracts(clientId: string | null) {
  return useQuery({
    queryKey: ["contracts", clientId],
    queryFn: async () => {
      // Only get active contracts for the selected client
      if (!clientId) return [];
      
      console.log(`Fetching contracts for client ${clientId}`);
      
      // Ensure we're returning the right format
      const filteredContracts = clientServices.filter(
        contract => contract.clientId === clientId && 
                   contract.status === "active"
      );
      
      console.log(`Found ${filteredContracts.length} active contracts:`, filteredContracts);
      
      // Add delay to simulate API call and ensure UI updates properly
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return filteredContracts;
    },
    // Only run the query if we have a clientId
    enabled: !!clientId,
    staleTime: 0, // Always refetch when clientId changes
    refetchOnMount: true
  });
}

/**
 * Hook to get the active contract for a specific client
 * @param clientId - Client ID to get active contract for
 * @returns Query with client's active contract
 */
export function useClientActiveContract(clientId: string | null) {
  return useQuery({
    queryKey: ["active-contract", clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      console.log(`Fetching active contract for client ${clientId}`);
      
      // Simulate API call to get active contract
      // In a real app, this would call an endpoint like /clients/:id/contract-active
      const activeContracts = clientServices.filter(
        contract => contract.clientId === clientId && contract.status === "active"
      );
      
      // Return the most recent contract (in a real app, this logic would be on the backend)
      const sortedContracts = activeContracts.sort((a, b) => {
        return new Date(b.contractStart).getTime() - new Date(a.contractStart).getTime();
      });
      
      const activeContract = sortedContracts[0] || null;
      console.log("Active contract selected:", activeContract);
      
      // Add delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return activeContract;
    },
    enabled: !!clientId,
    staleTime: 0, // Always refetch when clientId changes
    refetchOnMount: true
  });
}
