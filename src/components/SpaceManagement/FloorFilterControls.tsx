
import React from "react";
import { SpaceLegend } from "./SpaceLegend";

interface FloorFilterControlsProps {
  floorFilter: string;
  floorOptions: string[];
  onFloorChange: (floor: string) => void;
}

export function FloorFilterControls({
  floorFilter,
  floorOptions,
  onFloorChange
}: FloorFilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <h2 className="text-xl font-semibold">Mapa do Edifício</h2>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Andar:</span>
        <select 
          className="border rounded px-2 py-1 text-sm"
          value={floorFilter}
          onChange={(e) => onFloorChange(e.target.value)}
        >
          <option value="all">Todos</option>
          {floorOptions.map(floor => (
            <option key={floor} value={floor}>
              {floor}º Andar
            </option>
          ))}
          <option value="other">Outros Espaços</option>
        </select>
        <SpaceLegend />
      </div>
    </div>
  );
}
