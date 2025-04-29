
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { BuildingMap } from "@/components/SpaceManagement/BuildingMap";
import { OccupancyStats } from "@/components/SpaceManagement/OccupancyStats";
import { SpaceDetailsDialog } from "@/components/SpaceManagement/SpaceDetailsDialog"; 
import { SpaceLegend } from "@/components/SpaceManagement/SpaceLegend";
import { locations, clientServices } from "@/data/mockData";
import { Location } from "@/types";

export default function SpaceManagement() {
  const [selectedSpace, setSelectedSpace] = useState<Location | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Calculate occupancy statistics
  const stats = useMemo(() => {
    const totalSpaces = locations.length;
    const occupiedSpaces = locations.filter(space => !space.available).length;
    const occupancyRate = Math.round((occupiedSpaces / totalSpaces) * 100);
    const availableSpaces = totalSpaces - occupiedSpaces;
    
    const availableByType = locations.reduce((acc, space) => {
      if (space.available) {
        acc[space.type] = (acc[space.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSpaces,
      occupiedSpaces,
      occupancyRate,
      availableSpaces,
      availableByType
    };
  }, []);
  
  const handleSpaceClick = (space: Location) => {
    setSelectedSpace(space);
    setIsDetailsOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Espaços</h1>
        <p className="text-gray-500">Visualize e gerencie a ocupação de salas e estações</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Estatísticas de ocupação */}
        <Card className="lg:col-span-1 p-4">
          <OccupancyStats stats={stats} />
        </Card>
        
        {/* Mapa interativo */}
        <Card className="lg:col-span-3 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mapa do Edifício</h2>
            <SpaceLegend />
          </div>
          <BuildingMap 
            spaces={locations} 
            onSpaceClick={handleSpaceClick} 
          />
        </Card>
      </div>

      {/* Dialog para mostrar detalhes do espaço */}
      {selectedSpace && (
        <SpaceDetailsDialog
          space={selectedSpace}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          clientServices={clientServices.filter(
            service => service.locationId === selectedSpace.id
          )}
        />
      )}
    </div>
  );
}
