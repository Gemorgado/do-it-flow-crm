
import { useMemo } from "react";
import { Location } from "@/types";

export function useSpaceGrouping(spaces: Location[]) {
  // Group spaces by floor and type
  const groupedSpaces = useMemo(() => {
    const grouped: Record<string, Record<string, Location[]>> = {};
    
    // Create groups for different floors
    spaces.forEach(space => {
      if (space.type === "sala_privativa") {
        const floor = space.identifier.substring(0, 1);
        
        if (!grouped[floor]) {
          grouped[floor] = {
            sala_privativa: [],
            sala_reuniao: []
          };
        }
        
        grouped[floor][space.type].push(space);
      }
    });
    
    // Sort spaces within each group by identifier
    for (const floor in grouped) {
      for (const type in grouped[floor]) {
        grouped[floor][type].sort((a, b) => {
          return Number(a.identifier) - Number(b.identifier);
        });
      }
    }
    
    return grouped;
  }, [spaces]);
  
  // Group workstations by floor
  const workstationsByFloor = useMemo(() => {
    const grouped: Record<string, Location[]> = {};
    
    spaces.filter(space => space.type === "estacao").forEach(station => {
      let floor = "other";
      
      // Check if the station has a floor prefix like "1-01"
      if (station.identifier.includes("-")) {
        floor = station.identifier.split("-")[0];
      }
      
      if (!grouped[floor]) {
        grouped[floor] = [];
      }
      
      grouped[floor].push(station);
    });
    
    // Sort stations within each floor
    for (const floor in grouped) {
      grouped[floor].sort((a, b) => {
        // Extract numeric part for sorting
        const numA = a.identifier.includes("-") ? 
          parseInt(a.identifier.split("-")[1]) : parseInt(a.identifier);
        const numB = b.identifier.includes("-") ? 
          parseInt(b.identifier.split("-")[1]) : parseInt(b.identifier);
        return numA - numB;
      });
    }
    
    return grouped;
  }, [spaces]);
  
  // Filter other space types
  const otherSpaces = useMemo(() => {
    return spaces.filter(space => 
      space.type !== "sala_privativa" && 
      space.type !== "sala_reuniao" && 
      space.type !== "estacao"
    );
  }, [spaces]);

  // Get sorted floors (1, 2, 3...)
  const floors = useMemo(() => Object.keys(groupedSpaces).sort(), [groupedSpaces]);
  const workstationFloors = useMemo(() => Object.keys(workstationsByFloor).sort(), [workstationsByFloor]);
  
  return {
    groupedSpaces,
    workstationsByFloor,
    otherSpaces,
    floors,
    workstationFloors
  };
}
