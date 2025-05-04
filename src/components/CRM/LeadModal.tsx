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
import { Lead, PipelineStage } from "@/types";
import { v4 as uuidv4 } from 'uuid';

interface LeadModalProps {
  addLeadToPipeline?: (lead: Lead) => void;
}

/**
 * Modal para criação ou edição de leads
 */
export function LeadModal({ addLeadToPipeline }: LeadModalProps) {
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
          company: data.idNumber || options.leadToEdit.company,
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

  // Custom mutation for creating leads with pipeline integration
  const createLeadWithPipelineIntegration = useMutation({
    mutationFn: async (data: LeadFormValues & { stageId?: string }) => {
      try {
        // Find the correct stage object by ID or use the preset stage
        let stage: PipelineStage;
        
        if (options?.presetStage) {
          stage = options.presetStage;
        } else {
          // Default to stage 1 (New) if not specified
          stage = {
            id: data.stageId || "1",
            name: "Novo",
            order: 1,
            color: "#3b82f6"
          };
        }
        
        // Create a new Lead object with all required fields
        const newLead: Lead = {
          id: uuidv4(),
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          status: 'novo',
          source: data.sourceCategory === 'indicacao' ? 'indicacao' : 
                 data.sourceCategory === 'rede_social' ? 'instagram' : 'outros',
          sourceDetail: data.sourceDetail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stage: stage,
          notes: data.notes || '',
        };
        
        // Persist the lead
        await leadPersistence.createLead(newLead);
        
        return newLead;
      } catch (error) {
        console.error("Erro ao criar lead:", error);
        throw error;
      }
    },
    onSuccess: (newLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'leads'] });
      
      // Add the lead to the pipeline immediately if the function is provided
      if (addLeadToPipeline) {
        addLeadToPipeline(newLead);
      }
      
      toast.success("Lead criado com sucesso", {
        description: "O lead foi adicionado ao sistema"
      });
      
      close();
    },
    onError: (error) => {
      toast.error("Erro ao criar lead", {
        description: error instanceof Error ? error.message : "Não foi possível criar o lead"
      });
    }
  });

  const handleSubmit = async (data: LeadFormValues & { stageId?: string }) => {
    try {
      // Se for edição, usar mutation de atualização
      if (options?.leadToEdit) {
        await updateLeadMutation.mutateAsync(data);
      } else {
        // Use our custom mutation for creating leads with pipeline integration
        await createLeadWithPipelineIntegration.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error creating/updating lead:", error);
    }
  };

  const isSubmitting = createLeadMutation.isPending || 
                      updateLeadMutation.isPending || 
                      createLeadWithPipelineIntegration.isPending;
                      
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
