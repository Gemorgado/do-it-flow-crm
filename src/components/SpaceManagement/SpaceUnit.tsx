
import React from "react";
import { Location, SpaceBinding } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useClients } from "@/hooks/useClients";

interface SpaceUnitProps {
  space: Location;
  onClick: () => void;
}

export function SpaceUnit({ space, onClick }: SpaceUnitProps) {
  const { data: bindings = [] } = useSpaceBindings();
  const { data: clients = [] } = useClients();
  
  const spaceTypeLabel = {
    sala_privativa: "Sala Privativa",
    estacao: "Estação",
    sala_reuniao: "Sala de Reunião",
    endereco_fiscal: "Endereço Fiscal"
  };

  // Check if this space is bound to a client
  const binding = bindings.find(b => b.spaceId === space.id);
  
  // Get client info if space is bound
  const client = binding ? clients.find(c => c.id === binding.clientId) : null;
  
  // Determine space status color
  const getSpaceStatusClass = () => {
    if (binding) {
      return "bg-green-100 text-green-800 hover:bg-green-200"; // Occupied
    } else {
      return space.available ? 
        "bg-gray-100 text-gray-800 hover:bg-gray-200" : // Free
        "bg-red-100 text-red-800 hover:bg-red-200"; // Unavailable but not bound
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-full h-12 rounded-md flex items-center justify-center transition-all cursor-pointer",
            "border hover:scale-105 hover:shadow-md",
            getSpaceStatusClass(),
            binding ? "border-green-400" : "border-gray-200"
          )}
        >
          {space.identifier}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {spaceTypeLabel[space.type as keyof typeof spaceTypeLabel]} {space.identifier}
          <br />
          {client ? (
            <span className="text-green-600">Ocupado por: {client.name}</span>
          ) : (
            <span className={space.available ? "text-green-600" : "text-red-600"}>
              {space.available ? "Disponível" : "Indisponível"}
            </span>
          )}
          {space.area && <span> • {space.area}m²</span>}
          {space.capacity && <span> • Cap: {space.capacity}</span>}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
