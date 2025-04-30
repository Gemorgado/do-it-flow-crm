
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export function ClientModal({ isOpen, onClose, initialData }: ClientModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        
        <ClientForm 
          onSuccess={onClose}
          onCancel={onClose}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
