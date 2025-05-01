
import { useState, useEffect } from "react";
import { Location } from "@/types";
import { clientServices } from "@/data/mockData";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useFloorFilter } from "@/hooks/useFloorFilter";
import { useOccupancyStats } from "@/hooks/useOccupancyStats";
import { StatsSection } from "@/components/SpaceManagement/StatsSection";
import { BuildingMapSection } from "@/components/SpaceManagement/BuildingMapSection";
import { SpaceDetailsDialog } from "@/components/SpaceManagement/SpaceDetailsDialog"; 
import { SpaceBinderModal } from "@/components/SpaceManagement/SpaceBinderModal";
import { SpaceManagementHeader } from "@/components/SpaceManagement/SpaceManagementHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { persistence } from "@/integrations/persistence";
import { useQuery } from "@tanstack/react-query";

export default function SpaceManagement() {
  const [selectedSpace, setSelectedSpace] = useState<Location | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBinderOpen, setIsBinderOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Usar a persistência para buscar localizações
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: persistence.getLocations
  });
  
  const { data: spaceBindings = [] } = useSpaceBindings();
  const { floorFilter, setFloorFilter, floorOptions, filterSpacesByFloor } = useFloorFilter(locations);
  const stats = useOccupancyStats(locations, spaceBindings);
  
  // Filtrar espaços por andar
  const filteredSpaces = filterSpacesByFloor(locations);
  
  const handleSpaceClick = (space: Location) => {
    setSelectedSpace(space);
    
    // Verificar se já está vinculado a um cliente, mostrar detalhes ou vinculador
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
      
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Carregando espaços...</span>
        </div>
      ) : (
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
      )}

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
