
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { LeadFormValues } from "@/types/crm";
import { useCreateLead } from "@/api/crm";
import { useLeadModal } from "./hooks/useModalContext";
import { LeadForm } from "./LeadForm";

/**
 * Modal para criação de novos leads
 */
export function LeadModal() {
  const { isOpen, close, options } = useLeadModal();
  const { mutate, isPending } = useCreateLead();

  const handleSubmit = (data: LeadFormValues & { stageId?: string }) => {
    mutate(data, {
      onSuccess: () => {
        close();
      },
    });
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
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
