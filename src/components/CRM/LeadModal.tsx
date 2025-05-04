
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
import { useCreateLead } from "@/api/crm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadPersistence } from "@/integrations/persistence/leadPersistence";
import { toast } from "sonner";

/**
 * Modal para criação ou edição de leads
 */
export function LeadModal() {
  const { isOpen, close, options } = useLeadModal();
  const createLeadMutation = useCreateLead();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const queryClient = useQueryClient();

  // Mutation para atualizar lead existente
  const updateLeadMutation = useMutation({
    mutationFn: async (data: LeadFormValues & { stageId?: string }) => {
      if (!options?.leadToEdit) return null;
      
      try {
        const updatedLead = {
          ...options.leadToEdit,
          name: data.companyOrPerson || options.leadToEdit.name,
          company: data.company || options.leadToEdit.company,
          email: data.email || options.leadToEdit.email,
          phone: data.phone || options.leadToEdit.phone,
          notes: data.notes || options.leadToEdit.notes,
          updatedAt: new Date().toISOString()
        };
        
        // Se o estágio foi alterado, atualizar também
        if (data.stageId && data.stageId !== options.leadToEdit.stage.id) {
          const newStage = {
            id: data.stageId,
            name: "Estágio atualizado", // Ideal seria buscar o nome real do estágio
            order: parseInt(data.stageId),
            color: "#000000" // Ideal seria buscar a cor real do estágio
          };
          updatedLead.stage = newStage;
        }
        
        return await leadPersistence.updateLead(updatedLead);
      } catch (error) {
        console.error("Erro ao atualizar lead:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'leads'] });
      
      toast.success("Lead atualizado com sucesso", {
        description: "O lead foi atualizado no sistema"
      });
      
      close();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar lead", {
        description: error instanceof Error ? error.message : "Não foi possível atualizar o lead"
      });
    }
  });

  const handleSubmit = async (data: LeadFormValues & { stageId?: string }) => {
    try {
      // Se for edição, usar mutation de atualização
      if (options?.leadToEdit) {
        await updateLeadMutation.mutateAsync(data);
      } else {
        // Caso contrário, criar novo lead
        await createLeadMutation.mutateAsync(data);
      }
      
      // Close the modal on success
      close();
    } catch (error) {
      console.error("Error creating/updating lead:", error);
    }
  };

  const isSubmitting = createLeadMutation.isPending || updateLeadMutation.isPending;
  const modalTitle = options?.leadToEdit ? "Editar Lead" : "Novo Lead";

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
            <SheetTitle>{modalTitle}</SheetTitle>
          </SheetHeader>

          <div className="px-4 py-2 overflow-y-auto max-h-[80vh]">
            <LeadForm 
              onSubmit={handleSubmit} 
              onCancel={close} 
              presetStage={options?.presetStage} 
              leadToEdit={options?.leadToEdit}
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
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-2 overflow-y-auto">
          <LeadForm 
            onSubmit={handleSubmit} 
            onCancel={close} 
            presetStage={options?.presetStage}
            leadToEdit={options?.leadToEdit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
