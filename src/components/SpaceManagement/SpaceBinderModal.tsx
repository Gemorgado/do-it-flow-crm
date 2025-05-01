
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Location } from "@/types";
import { SpaceBinderModalContent } from "./SpaceBinderModalContent";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  if (!space) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Vincular Espaço a Cliente</DialogTitle>
        </DialogHeader>
        <SpaceBinderModalContent space={space} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
