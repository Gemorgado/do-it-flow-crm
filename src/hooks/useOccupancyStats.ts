
import { useMemo } from "react";
import { Location, SpaceBinding } from "@/types";

export function useOccupancyStats(locations: Location[], spaceBindings: SpaceBinding[]) {
  const stats = useMemo(() => {
    const totalSpaces = locations.length;
    const boundSpaces = spaceBindings.length;
    const occupiedSpaces = locations.filter(space => !space.available).length;
    const occupancyRate = Math.round(((occupiedSpaces + boundSpaces) / totalSpaces) * 100);
    const availableSpaces = totalSpaces - occupiedSpaces - boundSpaces;
    
    const availableByType = locations.reduce((acc, space) => {
      const isSpaceBound = spaceBindings.some(binding => binding.spaceId === space.id);
      
      if (space.available && !isSpaceBound) {
        acc[space.type] = (acc[space.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate available spaces by floor with separate counts for rooms and stations
    const availableByFloor = locations.reduce((acc, space) => {
      const isSpaceBound = spaceBindings.some(binding => binding.spaceId === space.id);
      
      if (space.available && !isSpaceBound) {
        let floor = "";
        
        if (space.type === "sala_privativa" || space.type === "sala_reuniao") {
          floor = space.identifier.substring(0, 1);
        } else if (space.type === "estacao" && space.identifier.includes("-")) {
          floor = space.identifier.split("-")[0];
        }
        
        // Only count spaces with valid floor numbers
        if (floor && !isNaN(Number(floor))) {
          if (!acc[floor]) {
            acc[floor] = { rooms: 0, stations: 0 };
          }
          
          if (space.type === "sala_privativa") {
            acc[floor].rooms += 1;
          } else if (space.type === "estacao") {
            acc[floor].stations += 1;
          }
        }
      }
      return acc;
    }, {} as Record<string, { rooms: number; stations: number }>);

    return {
      totalSpaces,
      occupiedSpaces: occupiedSpaces + boundSpaces,
      occupancyRate,
      availableSpaces,
      availableByType,
      availableByFloor,
      boundSpaces
    };
  }, [locations, spaceBindings]);

  return stats;
}
