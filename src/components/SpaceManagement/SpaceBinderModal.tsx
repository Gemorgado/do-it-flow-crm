
import React from "react";
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingBinding ? "Editar Vinculação" : "Atribuir Espaço"}
          </DialogTitle>
        </DialogHeader>
        
        {space && (
          <SpaceBinderModalContent 
            space={space}
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
            onClose={onClose}
            handleSave={handleSave}
            handleUnbind={handleUnbind}
            bindSpace={bindSpace}
            unbindSpace={unbindSpace}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
