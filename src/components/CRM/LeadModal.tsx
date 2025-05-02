
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>

        <LeadForm 
          onSubmit={handleSubmit} 
          onCancel={close} 
          presetStage={options?.presetStage} 
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
