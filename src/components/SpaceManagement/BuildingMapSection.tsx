
import React from "react";
import { Card } from "@/components/ui/card";
import { Location } from "@/types";
import { BuildingMap } from "./BuildingMap";
import { FloorFilterControls } from "./FloorFilterControls";

interface BuildingMapSectionProps {
  spaces: Location[];
  floorFilter: string;
  floorOptions: string[];
  onFloorChange: (floor: string) => void;
  onSpaceClick: (space: Location) => void;
}

export function BuildingMapSection({
  spaces,
  floorFilter,
  floorOptions,
  onFloorChange,
  onSpaceClick
}: BuildingMapSectionProps) {
  return (
    <Card className="lg:col-span-3 p-4">
      <div className="mb-4">
        <FloorFilterControls 
          floorFilter={floorFilter}
          floorOptions={floorOptions}
          onFloorChange={onFloorChange}
        />
      </div>
      <BuildingMap 
        spaces={spaces} 
        onSpaceClick={onSpaceClick} 
      />
    </Card>
  );
}
