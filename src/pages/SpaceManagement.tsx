
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { BuildingMap } from "@/components/SpaceManagement/BuildingMap";
import { OccupancyStats } from "@/components/SpaceManagement/OccupancyStats";
import { SpaceDetailsDialog } from "@/components/SpaceManagement/SpaceDetailsDialog"; 
import { SpaceBinderModal } from "@/components/SpaceManagement/SpaceBinderModal";
import { SpaceLegend } from "@/components/SpaceManagement/SpaceLegend";
import { locations, clientServices } from "@/data/mockData";
import { Location } from "@/types";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";

export default function SpaceManagement() {
  const [selectedSpace, setSelectedSpace] = useState<Location | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBinderOpen, setIsBinderOpen] = useState(false);
  const [floorFilter, setFloorFilter] = useState<string>("all");
  
  const { data: spaceBindings = [] } = useSpaceBindings();
  
  // Calculate occupancy statistics
  const stats = useMemo(() => {
    const totalSpaces = locations.length;
    const boundSpaces = spaceBindings.length;
    const occupiedSpaces = locations.filter(space => !space.available).length;
    const occupancyRate = Math.round(((occupiedSpaces + boundSpaces) / totalSpaces) * 100);
    const availableSpaces = totalSpaces - occupiedSpaces - boundSpaces;
    
    const availableByType = locations.reduce((acc, space) => {
      const isSpaceBound = spaceBindings.some(binding => binding.spaceId === space.id);
      
      if (space.available && !isSpaceBound) {
        acc[space.type] = (acc[space.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate available spaces by floor with separate counts for rooms and stations
    const availableByFloor = locations.reduce((acc, space) => {
      const isSpaceBound = spaceBindings.some(binding => binding.spaceId === space.id);
      
      if (space.available && !isSpaceBound) {
        let floor = "";
        
        if (space.type === "sala_privativa" || space.type === "sala_reuniao") {
          floor = space.identifier.substring(0, 1);
        } else if (space.type === "estacao" && space.identifier.includes("-")) {
          floor = space.identifier.split("-")[0];
        }
        
        // Only count spaces with valid floor numbers
        if (floor && !isNaN(Number(floor))) {
          if (!acc[floor]) {
            acc[floor] = { rooms: 0, stations: 0 };
          }
          
          if (space.type === "sala_privativa") {
            acc[floor].rooms += 1;
          } else if (space.type === "estacao") {
            acc[floor].stations += 1;
          }
        }
      }
      return acc;
    }, {} as Record<string, { rooms: number; stations: number }>);

    return {
      totalSpaces,
      occupiedSpaces: occupiedSpaces + boundSpaces,
      occupancyRate,
      availableSpaces,
      availableByType,
      availableByFloor,
      boundSpaces
    };
  }, [spaceBindings]);
  
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
    
    // Check if it's already bound to a client, show details or binder
    const isSpaceBound = spaceBindings.some(binding => binding.spaceId === space.id);
    
    if (isSpaceBound) {
      setIsBinderOpen(true);
    } else {
      setIsDetailsOpen(true);
    }
  };
  
  const handleAssignSpace = () => {
    setIsDetailsOpen(false);
    setIsBinderOpen(true);
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
          onAssignSpace={handleAssignSpace}
        />
      )}
      
      {/* Modal para vincular espaço a cliente */}
      <SpaceBinderModal
        isOpen={isBinderOpen}
        onClose={() => setIsBinderOpen(false)}
        space={selectedSpace}
      />
    </div>
  );
}
