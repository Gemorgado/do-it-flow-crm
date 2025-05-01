
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Location, ClientService, SpaceBinding } from "@/types";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useClients } from "@/hooks/useClients";
import { useUpdateSpace } from "@/hooks/useSpaceManagement";

// Import our new components
import { BasicSpaceInfo } from "./SpaceDetails/BasicSpaceInfo";
import { ClientBinding } from "./SpaceDetails/ClientBinding";
import { ServicesList } from "./SpaceDetails/ServicesList";
import { DialogActions } from "./SpaceDetails/DialogActions";

interface SpaceDetailsDialogProps {
  space: Location;
  isOpen: boolean;
  onClose: () => void;
  clientServices: ClientService[];
  onAssignSpace?: () => void;
}

export function SpaceDetailsDialog({ 
  space, 
  isOpen, 
  onClose, 
  clientServices,
  onAssignSpace
}: SpaceDetailsDialogProps) {
  const { data: bindings = [] } = useSpaceBindings();
  const { data: clients = [] } = useClients();
  const updateSpace = useUpdateSpace();
  
  // State for editable fields
  const [area, setArea] = useState<string>(space.area ? String(space.area) : "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Check if this space is bound to a client
  const binding = bindings.find(b => b.spaceId === space.id);
  const client = binding ? clients.find(c => c.id === binding.clientId) : null;
  
  // Reset state when dialog opens with new space
  useEffect(() => {
    if (space) {
      setArea(space.area ? String(space.area) : "");
      setIsEditing(false);
      
      if (binding) {
        // Initialize binding-related fields if they exist
        setUnitPrice(binding.unitPrice ? String(binding.unitPrice) : "");
        setStartDate(binding.startDate || "");
        setEndDate(binding.endDate || "");
      } else {
        setUnitPrice("");
        setStartDate("");
        setEndDate("");
      }
    }
  }, [space, binding]);
  
  const handleSaveChanges = () => {
    const updatedSpace = {
      ...space,
      area: area ? parseFloat(area) : undefined
    };
    
    const updatedBinding = binding ? {
      ...binding,
      unitPrice: unitPrice ? parseFloat(unitPrice) : binding.unitPrice,
      startDate: startDate || binding.startDate,
      endDate: endDate || binding.endDate
    } : null;

    updateSpace.mutate(
      { space: updatedSpace, binding: updatedBinding },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Espaço</span>
            <Badge variant={space.available ? "outline" : "secondary"}>
              {space.available ? "Disponível" : "Indisponível"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <BasicSpaceInfo 
            space={space} 
            isEditing={isEditing} 
            area={area} 
            setArea={setArea} 
          />
          
          {client && binding && (
            <ClientBinding 
              client={client}
              binding={binding}
              isEditing={isEditing}
              unitPrice={unitPrice}
              setUnitPrice={setUnitPrice}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          )}
          
          <ServicesList clientServices={clientServices} />
          
          <DialogActions 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveChanges={handleSaveChanges}
            isSpaceAvailable={space.available}
            onAssignSpace={onAssignSpace}
            isPending={updateSpace.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
