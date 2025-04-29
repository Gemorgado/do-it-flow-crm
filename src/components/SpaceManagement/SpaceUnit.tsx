
import React from "react";
import { Location } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SpaceUnitProps {
  space: Location;
  onClick: () => void;
}

export function SpaceUnit({ space, onClick }: SpaceUnitProps) {
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
