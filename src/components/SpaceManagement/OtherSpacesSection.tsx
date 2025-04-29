
import React from "react";
import { Location } from "@/types";
import { FloorSection } from "./FloorSection";

interface OtherSpacesSectionProps {
  spaces: Location[];
  onSpaceClick: (space: Location) => void;
}

export function OtherSpacesSection({ spaces, onSpaceClick }: OtherSpacesSectionProps) {
  if (!spaces || spaces.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-500">Outros Espaços</h3>
      <FloorSection 
        title=""
        spaceType="outro"
        spaces={spaces}
        onSpaceClick={onSpaceClick}
        gridCols="grid-cols-4 sm:grid-cols-6 gap-2"
      />
    </div>
  );
}
