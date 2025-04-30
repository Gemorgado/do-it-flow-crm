
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { toast } from "sonner";

/**
 * Hook para criar ou atualizar um cliente
 * @returns Mutation para criar/atualizar cliente com métodos mutate, isLoading e error
 */
export const useUpsertClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Client) => {
      try {
        // In a real app, this would be an API call
        // For now we'll just simulate it
        console.log("Saving client:", data);
        
        // Let's assume we're storing in localStorage for this mock
        const existingClients = JSON.parse(localStorage.getItem('clients') || '[]');
        const existingIndex = existingClients.findIndex((c: Client) => c.id === data.id);
        
        if (existingIndex >= 0) {
          // Update existing client
          existingClients[existingIndex] = { ...data };
        } else {
          // Add new client
          existingClients.push(data);
        }
        
        localStorage.setItem('clients', JSON.stringify(existingClients));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return data;
      } catch (error) {
        console.error("Error saving client:", error);
        throw error instanceof Error ? error : new Error("Unknown error saving client");
      }
    },
    onSuccess: () => {
      // Invalidate clients query
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      toast.success("Cliente salvo com sucesso", {
        description: "As informações foram atualizadas no sistema"
      });
      return null;
    },
    onError: (error: Error) => {
      toast.error("Erro ao salvar cliente", {
        description: error.message || "Não foi possível salvar o cliente. Tente novamente."
      });
      return null;
    },
  });
};

/**
 * Hook para buscar clientes
 * @returns Query com a lista de clientes
 */
export const useClientsQuery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        // In a real app, this would be an API call
        const clientsData = localStorage.getItem('clients');
        const clients = clientsData ? JSON.parse(clientsData) : [];
        
        return clients;
      } catch (error) {
        console.error("Error fetching clients:", error);
        throw error instanceof Error ? error : new Error("Unknown error fetching clients");
      }
    }
  });
};
