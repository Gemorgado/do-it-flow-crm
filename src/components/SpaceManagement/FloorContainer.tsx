
import React from "react";
import { Location } from "@/types";
import { FloorSection } from "./FloorSection";

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
      
      <FloorSection 
        title="Salas de Reunião"
        spaceType="sala_reuniao"
        spaces={meetingRooms}
        onSpaceClick={onSpaceClick}
      />
      
      <FloorSection 
        title="Estações de Trabalho"
        spaceType="estacao"
        spaces={workstations}
        onSpaceClick={onSpaceClick}
      />
    </div>
  );
}
