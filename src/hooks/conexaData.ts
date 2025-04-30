
import { useQuery } from "@tanstack/react-query";
import { persistence } from "@/integrations/persistence";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";

export function useTodayRoomOccupancy() {
  const { data: spaceBindings = [] } = useSpaceBindings();
  
  return useQuery({
    queryKey: ["todayOccupancy"],
    queryFn: async () => {
      // Use the space bindings to determine room occupancy
      return spaceBindings.map(binding => ({
        roomId: binding.spaceId,
        contractId: binding.contractId
      }));
    }
  }).data || [];
}

export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const snap = await persistence.getLastSnapshot();
      return snap?.contracts || [];
    }
  }).data || [];
}

/**
 * Hook to get all customers from Conexa data
 * @returns Array of customers
 */
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const snap = await persistence.getLastSnapshot();
      return snap?.customers || [];
    }
  }).data || [];
}

/**
 * Hook to get all services from Conexa data
 * @returns Array of services
 */
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const snap = await persistence.getLastSnapshot();
      return snap?.services || [];
    }
  }).data || [];
}
