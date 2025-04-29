
import React from "react";
import { Location } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BuildingMapProps {
  spaces: Location[];
  onSpaceClick: (space: Location) => void;
}

export function BuildingMap({ spaces, onSpaceClick }: BuildingMapProps) {
  // Organize spaces by type for the layout
  const privateRooms = spaces.filter(space => space.type === "sala_privativa");
  const workstations = spaces.filter(space => space.type === "estacao");
  const meetingRooms = spaces.filter(space => space.type === "sala_reuniao");
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <TooltipProvider>
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2 text-gray-500">Salas Privativas</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {privateRooms.map(room => (
              <SpaceUnit 
                key={room.id} 
                space={room} 
                onClick={() => onSpaceClick(room)} 
              />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2 text-gray-500">Estações de Trabalho</h3>
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
            {workstations.map(station => (
              <SpaceUnit 
                key={station.id} 
                space={station} 
                onClick={() => onSpaceClick(station)} 
              />
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-gray-500">Salas de Reunião</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {meetingRooms.map(room => (
              <SpaceUnit 
                key={room.id} 
                space={room} 
                onClick={() => onSpaceClick(room)} 
              />
            ))}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

interface SpaceUnitProps {
  space: Location;
  onClick: () => void;
}

function SpaceUnit({ space, onClick }: SpaceUnitProps) {
  const spaceTypeLabel = {
    sala_privativa: "Sala Privativa",
    estacao: "Estação",
    sala_reuniao: "Sala de Reunião",
    endereco_fiscal: "Endereço Fiscal"
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-full h-12 rounded-md flex items-center justify-center transition-all cursor-pointer",
            "border border-gray-200 hover:scale-105 hover:shadow-md",
            space.available ? 
              "bg-green-100 text-green-800 hover:bg-green-200" : 
              "bg-red-100 text-red-800 hover:bg-red-200"
          )}
        >
          {space.identifier}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {spaceTypeLabel[space.type as keyof typeof spaceTypeLabel]} {space.identifier}
          <br />
          <span className={space.available ? "text-green-600" : "text-red-600"}>
            {space.available ? "Disponível" : "Ocupado"}
          </span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
