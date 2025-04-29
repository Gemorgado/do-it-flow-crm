
import React from "react";
import { Location } from "@/types";
import { SpaceUnit } from "./SpaceUnit";

interface FloorSectionProps {
  title: string;
  spaceType: string;
  spaces: Location[];
  onSpaceClick: (space: Location) => void;
  gridCols?: string;
}

export function FloorSection({ 
  title, 
  spaceType, 
  spaces, 
  onSpaceClick,
  gridCols = "grid-cols-6 sm:grid-cols-10 md:grid-cols-12" 
}: FloorSectionProps) {
  if (spaces.length === 0) return null;
  
  let gridClassName = gridCols;
  
  // Adjust grid columns based on space type
  if (spaceType === "sala_privativa") {
    gridClassName = "grid-cols-5 sm:grid-cols-8 md:grid-cols-10";
  } else if (spaceType === "sala_reuniao") {
    gridClassName = "grid-cols-4 sm:grid-cols-6 md:grid-cols-8";
  }

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2 text-gray-500">{title}</h4>
      <div className={`grid ${gridClassName} gap-2`}>
        {spaces.map(space => (
          <SpaceUnit 
            key={space.id} 
            space={space} 
            onClick={() => onSpaceClick(space)} 
          />
        ))}
      </div>
    </div>
  );
}
