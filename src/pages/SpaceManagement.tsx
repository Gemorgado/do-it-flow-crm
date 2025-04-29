
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
  const [floorFilter, setFloorFilter] = useState<string>("all");
  
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

    const availableByFloor = locations.reduce((acc, space) => {
      if (space.available) {
        if (space.type === "sala_privativa") {
          const floor = space.identifier.substring(0, 1);
          acc[floor] = (acc[floor] || 0) + 1;
        } else if (space.type === "estacao" && space.identifier.includes("-")) {
          // Para estações com formato "X-YY", pega o X como o andar
          const floor = space.identifier.split("-")[0];
          acc[floor] = (acc[floor] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSpaces,
      occupiedSpaces,
      occupancyRate,
      availableSpaces,
      availableByType,
      availableByFloor
    };
  }, []);
  
  // Filter spaces by floor
  const filteredSpaces = useMemo(() => {
    if (floorFilter === "all") {
      return locations;
    }
    
    return locations.filter(space => {
      if (space.type === "estacao") {
        if (space.identifier.includes("-")) {
          // Para estações com formato "X-YY", filtra pelo X (número do andar)
          const floor = space.identifier.split("-")[0];
          return floor === floorFilter;
        }
        // Para estações antigas sem o formato de andar
        return floorFilter === "other";
      }
      
      if (space.type !== "sala_privativa" && space.type !== "sala_reuniao") {
        return floorFilter === "other";
      }
      
      const floor = space.identifier.substring(0, 1);
      return floor === floorFilter;
    });
  }, [floorFilter]);
  
  const handleSpaceClick = (space: Location) => {
    setSelectedSpace(space);
    setIsDetailsOpen(true);
  };

  const handleFloorChange = (floor: string) => {
    setFloorFilter(floor);
  };

  // Get available floor options
  const floorOptions = useMemo(() => {
    const floors = new Set<string>();
    
    locations.forEach(space => {
      if (space.type === "sala_privativa" || space.type === "sala_reuniao") {
        const floor = space.identifier.substring(0, 1);
        floors.add(floor);
      } else if (space.type === "estacao" && space.identifier.includes("-")) {
        // Para estações com formato "X-YY", pega o X como o andar
        const floor = space.identifier.split("-")[0];
        floors.add(floor);
      }
    });
    
    return Array.from(floors).sort();
  }, []);

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
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Mapa do Edifício</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Andar:</span>
              <select 
                className="border rounded px-2 py-1 text-sm"
                value={floorFilter}
                onChange={(e) => handleFloorChange(e.target.value)}
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
          <BuildingMap 
            spaces={filteredSpaces} 
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
