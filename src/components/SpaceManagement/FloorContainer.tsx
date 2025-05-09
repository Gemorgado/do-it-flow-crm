
import React from "react";
import { Location } from "@/types";
import { FloorSection } from "./FloorSection";
import { FloorWorkstations } from "./FloorWorkstations";

interface FloorContainerProps {
  floorNumber: string;
  privateRooms: Location[];
  meetingRooms: Location[];
  workstations: Location[];
  onSpaceClick: (space: Location) => void;
}

export function FloorContainer({ 
  floorNumber, 
  privateRooms, 
  meetingRooms, 
  workstations,
  onSpaceClick 
}: FloorContainerProps) {
  return (
    <div className="mb-8">
      <h3 className="text-md font-semibold mb-2">{floorNumber}º Andar</h3>
      
      <FloorSection 
        title="Salas Privativas"
        spaceType="sala_privativa"
        spaces={privateRooms}
        onSpaceClick={onSpaceClick}
      />
      
      {/* Removida a seção de salas de reunião */}
      
      <FloorWorkstations
        floor={floorNumber}
        workstations={workstations}
        onSpaceClick={onSpaceClick}
      />
    </div>
  );
}
