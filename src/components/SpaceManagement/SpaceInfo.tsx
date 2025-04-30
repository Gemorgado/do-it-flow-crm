
import React from "react";
import { Label } from "@/components/ui/label";
import { Location } from "@/types";

interface SpaceInfoProps {
  space: Location;
}

export function SpaceInfo({ space }: SpaceInfoProps) {
  return (
    <div>
      <Label>Espaço</Label>
      <div className="flex items-center mt-1 p-2 border rounded-md bg-gray-50">
        <span className="text-sm font-medium">{space.name || space.identifier}</span>
        <span className="ml-2 text-xs text-gray-500">({space.type})</span>
      </div>
    </div>
  );
}
