import React, { useMemo } from "react";
import { Location } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
      if (space.type === "sala_privativa" || space.type === "sala_reuniao") {
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
  
  // Filter stations and other space types
  const workstations = spaces.filter(space => space.type === "estacao");
  const otherSpaces = spaces.filter(space => 
    space.type !== "sala_privativa" && 
    space.type !== "sala_reuniao" && 
    space.type !== "estacao"
  );
  
  // Get sorted floors (1, 2, 3...)
  const floors = Object.keys(groupedSpaces).sort();

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <TooltipProvider>
        {/* Display rooms organized by floors */}
        {floors.map(floor => (
          <div key={floor} className="mb-8">
            <h3 className="text-md font-semibold mb-2">{floor}º Andar</h3>
            
            {/* Private rooms on this floor */}
            {groupedSpaces[floor].sala_privativa.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-gray-500">Salas Privativas</h4>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {groupedSpaces[floor].sala_privativa.map(room => (
                    <SpaceUnit 
                      key={room.id} 
                      space={room} 
                      onClick={() => onSpaceClick(room)} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Meeting rooms on this floor */}
            {groupedSpaces[floor].sala_reuniao.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-gray-500">Salas de Reunião</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {groupedSpaces[floor].sala_reuniao.map(room => (
                    <SpaceUnit 
                      key={room.id} 
                      space={room} 
                      onClick={() => onSpaceClick(room)} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Workstations section (not organized by floor) */}
        {workstations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Estações de Trabalho</h3>
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {workstations.map(station => (
                <SpaceUnit 
                  key={station.id} 
                  space={station} 
                  onClick={() => onSpaceClick(station)} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Other spaces section */}
        {otherSpaces.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Outros Espaços</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {otherSpaces.map(space => (
                <SpaceUnit 
                  key={space.id} 
                  space={space} 
                  onClick={() => onSpaceClick(space)} 
                />
              ))}
            </div>
          </div>
        )}
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
          {space.area && <span> • {space.area}m²</span>}
          {space.capacity && <span> • Cap: {space.capacity}</span>}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
