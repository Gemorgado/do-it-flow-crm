
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Location } from "@/types";
import { SpaceBinderModalContent } from "./SpaceBinderModalContent";
import { useSpaceBindingManager } from "@/hooks/useSpaceBindingManager";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  if (!space) return null;
  
  // Use our new unified hook for space binding management
  const spaceBindingProps = useSpaceBindingManager(space, onClose);
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Vincular Espaço a Cliente</DialogTitle>
        </DialogHeader>
        <SpaceBinderModalContent 
          space={space} 
          onClose={onClose}
          {...spaceBindingProps}
        />
      </DialogContent>
    </Dialog>
  );
}
