
import { useState } from "react";
import { Location } from "@/types";
import { locations, clientServices } from "@/data/mockData";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useFloorFilter } from "@/hooks/useFloorFilter";
import { useOccupancyStats } from "@/hooks/useOccupancyStats";
import { StatsSection } from "@/components/SpaceManagement/StatsSection";
import { BuildingMapSection } from "@/components/SpaceManagement/BuildingMapSection";
import { SpaceDetailsDialog } from "@/components/SpaceManagement/SpaceDetailsDialog"; 
import { SpaceBinderModal } from "@/components/SpaceManagement/SpaceBinderModal";
import { SpaceManagementHeader } from "@/components/SpaceManagement/SpaceManagementHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SpaceManagement() {
  const [selectedSpace, setSelectedSpace] = useState<Location | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBinderOpen, setIsBinderOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const { data: spaceBindings = [] } = useSpaceBindings();
  const { floorFilter, setFloorFilter, floorOptions, filterSpacesByFloor } = useFloorFilter(locations);
  const stats = useOccupancyStats(locations, spaceBindings);
  
  // Filter spaces by floor
  const filteredSpaces = filterSpacesByFloor(locations);
  
  const handleSpaceClick = (space: Location) => {
    setSelectedSpace(space);
    
    // Check if it's already bound to a client, show details or binder
    const isSpaceBound = spaceBindings.some(binding => binding.spaceId === space.id);
    
    if (isSpaceBound) {
      setIsDetailsOpen(true);
    } else {
      setIsDetailsOpen(true); // Alterado para mostrar sempre os detalhes primeiro
    }
  };
  
  const handleAssignSpace = () => {
    setIsDetailsOpen(false);
    setIsBinderOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <SpaceManagementHeader />
      
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {/* Estatísticas de ocupação */}
        <StatsSection stats={stats} />
        
        {/* Mapa interativo */}
        <BuildingMapSection 
          spaces={filteredSpaces}
          floorFilter={floorFilter}
          floorOptions={floorOptions}
          onFloorChange={setFloorFilter}
          onSpaceClick={handleSpaceClick}
        />
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
