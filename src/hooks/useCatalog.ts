
import { useState } from 'react';
import { catalog2025 } from '@/integrations/catalog/seed2025';
import { Plan } from '@/integrations/catalog/types';

export function useCatalog() {
  // In a real application, this would likely use React Query to fetch from an API
  // and have mutation functions for updates
  return catalog2025;
}

export function useEditableCatalog() {
  const [plans, setPlans] = useState<Plan[]>(catalog2025);
  
  const updatePlan = (updatedPlan: Plan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };
  
  const saveCatalog = async () => {
    // In a real application, this would save to a database or API
    console.log("Saving catalog:", plans);
    // Example API call: await api.post('/catalog', { plans });
    return true;
  };
  
  return { plans, updatePlan, saveCatalog };
}
