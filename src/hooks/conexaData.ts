
import { useQuery } from "@tanstack/react-query";
import { persistence } from "@/integrations/persistence";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useSnapshot } from "@/contexts/SnapshotProvider";

// Define interface for space statistics
export interface SpaceStats {
  privateRooms: number;
  meetingRooms: {
    total: number;
    capacity: number;
  };
  workstations: {
    total: number;
    flex: number;
    fixed: number;
  };
}

export function useTodayRoomOccupancy() {
  const { data: spaceBindings = [] } = useSpaceBindings();
  
  return useQuery({
    queryKey: ["todayOccupancy"],
    queryFn: async () => {
      // Use the space bindings to determine room occupancy
      return spaceBindings.map(binding => ({
        roomId: binding.spaceId,
        contractId: binding.contractId,
        amount: binding.unitPrice,
        startDate: binding.startDate,
        endDate: binding.endDate
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

/**
 * Hook to get space statistics
 * @returns Statistics about space usage
 */
export function useSpaceStats(): SpaceStats {
  const { data: bindings = [] } = useSpaceBindings();
  const snap = useSnapshot();
  
  // Calculate meeting rooms from room occupations, not directly from snapshot
  const totalMeetingRooms = snap?.roomOccupations?.length || 0;
  
  return {
    privateRooms: bindings.filter(b => b.spaceId.startsWith('sala-')).length,
    meetingRooms: {
      total: totalMeetingRooms,
      capacity: 0, // We don't have capacity data available directly
    },
    workstations: {
      total: bindings.filter(b => b.spaceId.startsWith('estacao-')).length,
      flex: bindings.filter(b => b.spaceId.startsWith('estacao-flex-')).length,
      fixed: bindings.filter(b => b.spaceId.startsWith('estacao-fixa-')).length,
    }
  };
}
