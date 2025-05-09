
import { useState, useEffect } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { useQuery } from "@tanstack/react-query";
import { persistence } from "@/integrations/persistence";
import { Location, SpaceBinding } from "@/types";
import { ServiceType } from "@/types/service";

export function useClientFormEnhancements() {
  const catalog = useCatalog();
  
  // Fetch available spaces
  const { data: spaces = [], isLoading: isLoadingSpaces } = useQuery({
    queryKey: ['locations'],
    queryFn: persistence.getLocations,
  });
  
  // Fetch existing bindings to filter out already occupied spaces
  const { data: bindings = [], isLoading: isLoadingBindings } = useQuery({
    queryKey: ['spaces', 'bindings'],
    queryFn: persistence.listBindings,
  });

  // Format catalog plans for the select component
  const planOptions = catalog.map(plan => ({
    value: plan.category,
    label: plan.title.replace(/^[🧾💼🧑‍💼🗣️🎤]\s+/, ''), // Remove emoji prefix
  }));

  // Get available spaces based on selected plan type
  const getAvailableSpaces = (planType: ServiceType): Location[] => {
    if (!planType) return [];

    // Filter spaces based on plan type
    let filteredSpaces: Location[] = [];
    
    if (planType === 'private_office') {
      filteredSpaces = spaces.filter(space => 
        space.type === 'private_office' || space.type === 'fiscal_address'
      );
    } else if (planType === 'fixed_desk') {
      filteredSpaces = spaces.filter(space => 
        space.type === 'fixed_desk' || space.type === 'flex_desk'
      );
    }
    
    // Filter out already occupied spaces
    const occupiedSpaceIds = bindings.map(binding => binding.spaceId);
    return filteredSpaces.filter(space => !occupiedSpaceIds.includes(space.id));
  };

  return {
    planOptions,
    getAvailableSpaces,
    isLoading: isLoadingSpaces || isLoadingBindings
  };
}
