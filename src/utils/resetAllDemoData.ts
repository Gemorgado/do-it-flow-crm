
import { queryClient } from "@/lib/queryClient";

export async function resetAllDemoData() {
  try {
    // List of localStorage keys to remove
    const keysToRemove = [
      // Metrics and dashboard data
      'dashboard_metrics', 
      'growth_metrics', 
      'report_metrics',
      
      // CRM data
      'leads', 
      'clients', 
      'contracts', 
      'proposals', 
      'pipeline_stages',
      
      // Space management data
      'spaceBindings', 
      'occupancy_trend',
      
      // Integration data
      'integrations',
      
      // Import data
      'conexa_snapshot', 
      'import_templates',
      
      // Reservation data
      'reservations',
    ];
    
    // Remove each key from localStorage
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error(`Error removing ${key} from localStorage:`, err);
      }
    });
    
    // Clear React Query cache
    queryClient.clear();
    
    return true;
  } catch (error) {
    console.error("Error resetting demo data:", error);
    throw error;
  }
}
