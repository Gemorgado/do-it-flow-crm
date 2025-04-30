
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
    },
    onSuccess: () => {
      // Invalidate both the pipeline leads and general leads queries
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      toast.success({
        title: "Lead criado com sucesso",
        description: "O lead foi adicionado ao sistema",
      });
    },
    onError: (error: Error) => {
      toast.error({
        title: "Erro ao criar lead",
        description: error.message,
      });
    },
  });
};

/**
 * Hook para criar um novo contato
 * @returns Mutation para criar contato com métodos mutate, isLoading e error
 */
export const useCreateContact = () => {
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
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
    },
    onSuccess: () => {
      toast.success({
        title: "Contato criado com sucesso",
        description: "O contato foi adicionado ao sistema",
      });
    },
    onError: (error: Error) => {
      toast.error({
        title: "Erro ao criar contato",
        description: error.message,
      });
    },
  });
};
