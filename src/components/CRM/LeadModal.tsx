
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-mobile";
import { LeadFormValues } from "@/types/crm";
import { useLeadModal } from "./hooks/useModalContext";
import { LeadForm } from "./LeadForm";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Modal para criação de novos leads
 */
export function LeadModal() {
  const { isOpen, close, options } = useLeadModal();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleSubmit = (data: LeadFormValues & { stageId?: string }) => {
    setIsSubmitting(true);
    
    // Simular uma operação assíncrona
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Invalidar as queries para atualizar os dados na UI
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      // Fechar o modal
      close();
    }, 1000);
  };

  // Use Sheet em dispositivos móveis e Dialog em desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent 
          className="pt-6 px-0 overflow-y-auto"
          style={{
            backgroundColor: "white",
            opacity: 1,
            zIndex: 110,
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.25)'
          }}
        >
          <SheetHeader className="px-4">
            <SheetTitle>Novo Lead</SheetTitle>
          </SheetHeader>

          <div className="px-4 py-2 overflow-y-auto max-h-[80vh]">
            <LeadForm 
              onSubmit={handleSubmit} 
              onCancel={close} 
              presetStage={options?.presetStage} 
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent 
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: "white", 
          opacity: 1, 
          zIndex: 150,
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.25)'
        }}
      >
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>

        <div className="py-2 overflow-y-auto">
          <LeadForm 
            onSubmit={handleSubmit} 
            onCancel={close} 
            presetStage={options?.presetStage} 
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
