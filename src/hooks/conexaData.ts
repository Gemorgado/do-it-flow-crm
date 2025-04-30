
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
