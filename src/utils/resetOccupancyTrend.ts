
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

/**
 * Reset occupancy trend data stored in localStorage and invalidate related query cache.
 */
export function resetOccupancyTrend() {
  // Remove the dataset from local storage
  localStorage.removeItem('occupancy_trend');
  
  // Invalidate any related React Query caches
  queryClient.invalidateQueries({ queryKey: ['occupancy_trend'] });
  
  console.log("✓ Occupancy trend data reset successfully");
  
  return true;
}
