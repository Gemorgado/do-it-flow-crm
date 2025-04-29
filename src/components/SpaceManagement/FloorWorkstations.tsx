
import React from "react";
import { Location } from "@/types";
import { FloorSection } from "./FloorSection";

interface FloorWorkstationsProps {
  floor: string;
  workstations: Location[];
  onSpaceClick: (space: Location) => void;
}

export function FloorWorkstations({ floor, workstations, onSpaceClick }: FloorWorkstationsProps) {
  // Only render if there are workstations for this floor
  if (!workstations || workstations.length === 0) return null;
  
  return (
    <FloorSection 
      title="Estações de Trabalho"
      spaceType="estacao"
      spaces={workstations}
      onSpaceClick={onSpaceClick}
    />
  );
}
