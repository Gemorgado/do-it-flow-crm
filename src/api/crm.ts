
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadFormValues, ContactFormValues } from "@/types/crm";
import { toast } from "sonner";

/**
 * Hook para criar um novo lead
 * @returns Mutation para criar lead com métodos mutate, isLoading e error
 */
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LeadFormValues & { stageId?: string }) => {
      try {
        const response = await fetch(`/api/crm/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao criar lead");
        }

        return response.json();
      } catch (error) {
        console.error("Erro na criação do lead:", error);
        throw error instanceof Error ? error : new Error("Erro desconhecido ao criar lead");
      }
    },
    onSuccess: () => {
      // Invalidate both the pipeline leads and general leads queries
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      toast.success("Lead criado com sucesso", {
        description: "O lead foi adicionado ao sistema"
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar lead", {
        description: error.message || "Não foi possível criar o lead. Tente novamente."
      });
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
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar contato", {
        description: error.message || "Não foi possível criar o contato. Tente novamente."
      });
    },
  });
};
