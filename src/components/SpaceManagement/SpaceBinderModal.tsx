
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Location } from "@/types";
import { SpaceBinderModalContent } from "./SpaceBinderModalContent";
import { useSpaceBinding } from "@/hooks/useSpaceBinding";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  if (!space) return null;
  
  // Use the hook to get all the needed props for the SpaceBinderModalContent
  const {
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    contractId,
    unitPrice,
    startDate,
    endDate,
    existingBinding,
    isLoadingContract,
    activeContract,
    handleSave,
    handleUnbind,
    bindSpace,
    unbindSpace
  } = useSpaceBinding(space, onClose);
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Vincular Espaço a Cliente</DialogTitle>
        </DialogHeader>
        <SpaceBinderModalContent 
          space={space} 
          onClose={onClose}
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          contractId={contractId}
          unitPrice={unitPrice}
          startDate={startDate}
          endDate={endDate}
          existingBinding={existingBinding}
          isLoadingContract={isLoadingContract}
          activeContract={activeContract}
          handleSave={handleSave}
          handleUnbind={handleUnbind}
          bindSpace={bindSpace}
          unbindSpace={unbindSpace}
        />
      </DialogContent>
    </Dialog>
  );
}
