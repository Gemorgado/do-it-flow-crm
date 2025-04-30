
import React from "react";
import { Location, SpaceBinding } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useClients } from "@/hooks/useClients";
import { isAfter, parseISO } from "date-fns";

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
  
  // Check if this is a future reservation
  const isFutureReservation = binding?.startDate ? 
    isAfter(parseISO(binding.startDate), new Date()) : false;
  
  // Determine space status color
  const getSpaceStatusClass = () => {
    if (binding) {
      if (isFutureReservation) {
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-400"; // Future reservation
      }
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-400"; // Current occupation
    } else {
      return space.available ? 
        "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200" : // Free
        "bg-red-100 text-red-800 hover:bg-red-200 border-red-300"; // Unavailable but not bound
    }
  };

  // Format currency
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-full h-12 rounded-md flex items-center justify-center transition-all cursor-pointer",
            "border hover:scale-105 hover:shadow-md",
            getSpaceStatusClass()
          )}
        >
          {space.identifier}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <p>
            {spaceTypeLabel[space.type as keyof typeof spaceTypeLabel]} {space.identifier}
          </p>
          {client ? (
            <>
              <p className="font-medium text-green-600">{client.name}</p>
              {binding?.unitPrice && (
                <p className="text-xs mt-1">{formatCurrency(binding.unitPrice)}/mês</p>
              )}
              {isFutureReservation && (
                <p className="text-xs text-yellow-600 mt-1">Reserva futura</p>
              )}
            </>
          ) : (
            <p className={space.available ? "text-green-600" : "text-red-600"}>
              {space.available ? "Disponível" : "Indisponível"}
            </p>
          )}
          {space.area && <p className="text-xs mt-1">Área: {space.area}m²</p>}
          {space.capacity && <p className="text-xs">Capacidade: {space.capacity}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
