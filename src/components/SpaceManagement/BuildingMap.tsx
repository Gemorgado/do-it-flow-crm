import React, { useMemo } from "react";
import { Location } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloorContainer } from "./FloorContainer";
import { FloorSection } from "./FloorSection";

interface BuildingMapProps {
  spaces: Location[];
  onSpaceClick: (space: Location) => void;
}

export function BuildingMap({ spaces, onSpaceClick }: BuildingMapProps) {
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
  const otherSpaces = spaces.filter(space => 
    space.type !== "sala_privativa" && 
    space.type !== "sala_reuniao" && 
    space.type !== "estacao"
  );
  
  // Get sorted floors (1, 2, 3...)
  const floors = Object.keys(groupedSpaces).sort();
  const workstationFloors = Object.keys(workstationsByFloor).sort();

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <TooltipProvider>
        {/* Display rooms organized by floors */}
        {floors.map(floor => (
          <FloorContainer
            key={floor}
            floorNumber={floor}
            privateRooms={groupedSpaces[floor].sala_privativa}
            meetingRooms={[]} {/* Passamos um array vazio para as salas de reunião */}
            workstations={workstationsByFloor[floor] || []}
            onSpaceClick={onSpaceClick}
          />
        ))}
        
        {/* Display workstation floors that don't have rooms */}
        {workstationFloors
          .filter(floor => !floors.includes(floor) && floor !== "other")
          .map(floor => (
            <FloorContainer
              key={floor}
              floorNumber={floor}
              privateRooms={[]}
              meetingRooms={[]} {/* Passamos um array vazio para as salas de reunião */}
              workstations={workstationsByFloor[floor]}
              onSpaceClick={onSpaceClick}
            />
          ))}
        
        {/* Other workstations section (not organized by floor) */}
        {workstationsByFloor.other && workstationsByFloor.other.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Outras Estações</h3>
            <FloorSection 
              title=""
              spaceType="estacao"
              spaces={workstationsByFloor.other}
              onSpaceClick={onSpaceClick}
            />
          </div>
        )}
        
        {/* Other spaces section */}
        {otherSpaces.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Outros Espaços</h3>
            <FloorSection 
              title=""
              spaceType="outro"
              spaces={otherSpaces}
              onSpaceClick={onSpaceClick}
              gridCols="grid-cols-4 sm:grid-cols-6 gap-2"
            />
          </div>
        )}
      </TooltipProvider>
    </div>
  );
}
