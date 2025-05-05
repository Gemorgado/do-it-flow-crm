
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadFormValues, ContactFormValues } from "@/types/crm";
import { toast } from "sonner";
import { Lead, PipelineStage, LeadSource } from "@/types";
import { persistence } from "@/integrations/persistence";
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook para criar um novo lead
 * @returns Mutation para criar lead com métodos mutate, isLoading e error
 */
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LeadFormValues & { stageId?: string }) => {
      try {
        // Create a proper PipelineStage object rather than just an ID
        const stageId = data.stageId || "1"; // Default to first stage (Novo) if not specified
        
        // Construct the stage object (in a real app, fetch this from the DB or cache)
        const stage: PipelineStage = {
          id: stageId,
          name: stageId === "1" ? "Novo" : 
                stageId === "2" ? "Qualificado" : 
                stageId === "3" ? "Proposta" : 
                stageId === "4" ? "Negociação" : 
                stageId === "5" ? "Fechado" : "Desconhecido",
          order: parseInt(stageId),
          color: stageId === "1" ? "#3b82f6" :  // blue for new
                 stageId === "2" ? "#8b5cf6" :  // purple for qualified
                 stageId === "3" ? "#10b981" :  // emerald for proposal
                 stageId === "4" ? "#f59e0b" :  // amber for negotiation
                 stageId === "5" ? "#22c55e" :  // green for closed
                 "#64748b"  // slate as default
        };
        
        // Map source category to valid source type
        // Fix TypeScript error by ensuring we only use valid LeadSource values
        const sourceMap: Record<string, LeadSource> = {
          'indicacao': 'indicacao' as LeadSource,
          'rede_social': 'instagram' as LeadSource,
          'outro': 'outros' as LeadSource
        };
        
        // Create new lead with all required fields
        const newLead: Lead = {
          id: uuidv4(),
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          status: 'novo',
          source: (sourceMap[data.sourceCategory] || 'outros') as LeadSource,
          sourceDetail: data.sourceDetail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stage: stage,
          notes: data.notes || '',
        };
        
        // Store the lead in persistence
        await persistence.createLead(newLead);
        
        return newLead;
      } catch (error) {
        console.error("Erro na criação do lead:", error);
        throw error instanceof Error ? error : new Error("Erro desconhecido ao criar lead");
      }
    },
    onSuccess: (newLead) => {
      // Invalidate both the pipeline leads and general leads queries
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      toast.success("Lead criado com sucesso", {
        description: "O lead foi adicionado ao sistema e ao pipeline"
      });
      
      // Return the created lead so it can be used by components
      return newLead;
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar lead", {
        description: error.message || "Não foi possível criar o lead. Tente novamente."
      });
      return null;
    },
  });
};

/**
 * Hook para criar um novo contato
 * @returns Mutation para criar contato com métodos mutate, isLoading e error
 */
export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
      try {
        const response = await fetch(`/api/crm/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao criar contato");
        }

        return response.json();
      } catch (error) {
        console.error("Erro na criação do contato:", error);
        throw error instanceof Error ? error : new Error("Erro desconhecido ao criar contato");
      }
    },
    onSuccess: () => {
      // Invalidate contacts query
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      
      toast.success("Contato criado com sucesso", {
        description: "O contato foi adicionado ao sistema"
      });
      return null;
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar contato", {
        description: error.message || "Não foi possível criar o contato. Tente novamente."
      });
      return null;
    },
  });
};
