
import React from "react";
import { Location } from "@/types";
import { FloorSection } from "./FloorSection";

interface OtherWorkstationsProps {
  workstations: Location[];
  onSpaceClick: (space: Location) => void;
}

export function OtherWorkstations({ workstations, onSpaceClick }: OtherWorkstationsProps) {
  if (!workstations || workstations.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium mb-2 text-gray-500">Outras Estações</h3>
      <FloorSection 
        title=""
        spaceType="estacao"
        spaces={workstations}
        onSpaceClick={onSpaceClick}
      />
    </div>
  );
}
