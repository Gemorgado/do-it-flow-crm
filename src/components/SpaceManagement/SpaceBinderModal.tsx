
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSpaceBinderManager } from "@/hooks/useSpaceBinderManager";
import { SpaceBinderModalContent } from "./SpaceBinderModalContent";
import { Location } from "@/types";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  if (!space) return null;
  
  // Use the hook to manage space binding
  const binderManager = useSpaceBinderManager(space, onClose);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign {space.name}</DialogTitle>
        </DialogHeader>
        
        <SpaceBinderModalContent 
          space={space}
          selectedClientId={binderManager.selectedClientId}
          setSelectedClientId={binderManager.setSelectedClientId}
          searchQuery={binderManager.searchQuery}
          setSearchQuery={binderManager.setSearchQuery}
          contractId={binderManager.contractId}
          setContractId={binderManager.setContractId}
          unitPrice={binderManager.unitPrice}
          setUnitPrice={binderManager.setUnitPrice}
          startDate={binderManager.startDate}
          setStartDate={binderManager.setStartDate}
          endDate={binderManager.endDate}
          setEndDate={binderManager.setEndDate}
          existingBinding={binderManager.existingBinding}
          isLoading={binderManager.isLoading}
          isLoadingClients={binderManager.isLoadingClients}
          isLoadingContract={binderManager.isLoadingContract}
          activeContract={binderManager.activeContract}
          clients={binderManager.clients}
          handleSave={binderManager.handleSave}
          handleUnbind={binderManager.handleUnbind}
          canSave={binderManager.canSave}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
