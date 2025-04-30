
import { useQuery } from "@tanstack/react-query";
import { clients, clientServices } from "@/data/mockData";
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
                   contract.status === "ativo"
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
