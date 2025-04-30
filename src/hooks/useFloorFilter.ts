
import { useState, useMemo } from "react";
import { Location } from "@/types";

export function useFloorFilter(locations: Location[]) {
  const [floorFilter, setFloorFilter] = useState<string>("all");
  
  // Get available floor options
  const floorOptions = useMemo(() => {
    const floors = new Set<string>();
    
    locations.forEach(space => {
      if (space.type === "sala_privativa" || space.type === "sala_reuniao") {
        const floor = space.identifier.substring(0, 1);
        floors.add(floor);
      } else if (space.type === "estacao" && space.identifier.includes("-")) {
        // Para estações com formato "X-YY", pega o X como o andar
        const floor = space.identifier.split("-")[0];
        floors.add(floor);
      }
    });
    
    return Array.from(floors).sort();
  }, [locations]);

  // Filter spaces by floor
  const filterSpacesByFloor = useMemo(() => {
    return (spaces: Location[]) => {
      if (floorFilter === "all") {
        return spaces;
      }
      
      return spaces.filter(space => {
        if (space.type === "estacao") {
          if (space.identifier.includes("-")) {
            // Para estações com formato "X-YY", filtra pelo X (número do andar)
            const floor = space.identifier.split("-")[0];
            return floor === floorFilter;
          }
          // Para estações antigas sem o formato de andar
          return floorFilter === "other";
        }
        
        if (space.type !== "sala_privativa" && space.type !== "sala_reuniao") {
          return floorFilter === "other";
        }
        
        const floor = space.identifier.substring(0, 1);
        return floor === floorFilter;
      });
    };
  }, [floorFilter]);

  return {
    floorFilter,
    setFloorFilter,
    floorOptions,
    filterSpacesByFloor
  };
}
