import React from "react";
import { Location } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloorContainer } from "./FloorContainer";
import { FloorWorkstations } from "./FloorWorkstations";
import { OtherWorkstations } from "./OtherWorkstations";
import { OtherSpacesSection } from "./OtherSpacesSection";
import { useSpaceGrouping } from "@/hooks/useSpaceGrouping";

interface BuildingMapProps {
  spaces: Location[];
  onSpaceClick: (space: Location) => void;
}

export function BuildingMap({ spaces, onSpaceClick }: BuildingMapProps) {
  const {
    groupedSpaces,
    workstationsByFloor,
    otherSpaces,
    floors,
    workstationFloors
  } = useSpaceGrouping(spaces);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <TooltipProvider>
        {/* Display rooms organized by floors */}
        {floors.map(floor => (
          <FloorContainer
            key={floor}
            floorNumber={floor}
            privateRooms={groupedSpaces[floor].sala_privativa}
            meetingRooms={[]} 
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
              meetingRooms={[]} 
              workstations={workstationsByFloor[floor]}
              onSpaceClick={onSpaceClick}
            />
          ))}
        
        {/* Other workstations section (not organized by floor) */}
        <OtherWorkstations
          workstations={workstationsByFloor.other || []}
          onSpaceClick={onSpaceClick}
        />
        
        {/* Other spaces section */}
        <OtherSpacesSection
          spaces={otherSpaces}
          onSpaceClick={onSpaceClick}
        />
      </TooltipProvider>
    </div>
  );
}
