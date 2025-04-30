
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
      
      return clientServices.filter(
        contract => contract.clientId === clientId && 
                   contract.status === "ativo"
      );
    },
    // Only run the query if we have a clientId
    enabled: !!clientId
  });
}
