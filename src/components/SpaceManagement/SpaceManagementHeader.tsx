
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpaceManagementHeaderProps {
  title?: string;
  description?: string;
}

export function SpaceManagementHeader({ 
  title = "Gerenciamento de Espaços",
  description = "Visualize e gerencie a ocupação de salas e estações"
}: SpaceManagementHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6">
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight`}>
        {title}
      </h1>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
