
import { SpaceBinding, Location } from "@/types";
import { useBindSpace, useUnbindSpace } from "@/hooks/useSpaceBindings";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface SpaceBindingActionsProps {
  space: Location | null;
  selectedClientId: string | null;
  contractId: string | null;
  unitPrice: number | null;
  startDate: string | null;
  endDate: string | null;
  onClose: () => void;
}

/**
 * Hook to handle actions for space binding (save, unbind)
 */
export function useSpaceBindingActions({
  space,
  selectedClientId,
  contractId,
  unitPrice,
  startDate,
  endDate,
  onClose
}: SpaceBindingActionsProps) {
  const bindSpace = useBindSpace();
  const unbindSpace = useUnbindSpace();
  
  const handleSave = () => {
    if (!space) {
      toast.error("Erro", {
        description: "Nenhum espaço selecionado"
      });
      return;
    }
    
    if (!selectedClientId) {
      toast.error("Dados incompletos", {
        description: "Selecione um cliente para vincular o espaço"
      });
      return;
    }
    
    if (!contractId) {
      toast.error("Dados incompletos", {
        description: "Cliente não possui contrato ativo"
      });
      return;
    }
    
    if (!startDate) {
      toast.error("Dados incompletos", {
        description: "Data de início é obrigatória"
      });
      return;
    }
    
    const binding: SpaceBinding = {
      id: uuidv4(),
      spaceId: space.id,
      clientId: selectedClientId,
      contractId: contractId,
      boundAt: new Date().toISOString(), // Ensure this is always set
      unitPrice,
      startDate,
      endDate
    };
    
    console.log("Saving binding:", binding);
    bindSpace.mutate(binding);
    onClose();
  };
  
  const handleUnbind = () => {
    if (!space) return;
    unbindSpace.mutate(space.id);
    onClose();
  };
  
  return {
    handleSave,
    handleUnbind,
    bindSpace,
    unbindSpace,
    // Helper to determine if form can be saved
    canSave: !!space && !!selectedClientId && !!contractId && !!startDate
  };
}
