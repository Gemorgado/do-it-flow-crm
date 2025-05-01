
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Location } from "@/types";

interface BasicSpaceInfoProps {
  space: Location;
  isEditing: boolean;
  area: string;
  setArea: (value: string) => void;
}

export function BasicSpaceInfo({ space, isEditing, area, setArea }: BasicSpaceInfoProps) {
  // Map service types to human-readable names
  const serviceTypeLabels = {
    sala_privativa: "Sala Privativa",
    estacao: "Estação de Trabalho",
    sala_reuniao: "Sala de Reunião",
    endereco_fiscal: "Endereço Fiscal"
  };
  
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Identificador</h3>
        <p>{space.identifier}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
        <p>{serviceTypeLabels[space.type as keyof typeof serviceTypeLabels] || space.type}</p>
      </div>
      
      <div>
        <Label htmlFor="area" className="text-sm font-medium text-gray-500">Área (m²)</Label>
        {isEditing ? (
          <Input
            id="area"
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-1"
            min="0"
            step="0.01"
          />
        ) : (
          <p>{space.area ? `${space.area} m²` : "Não definida"}</p>
        )}
      </div>
      
      {space.capacity && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Capacidade</h3>
          <p>{space.capacity} pessoa{space.capacity > 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}
