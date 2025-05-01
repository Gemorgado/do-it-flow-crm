
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Location, SpaceBinding } from "@/types";
import { persistence } from "@/integrations/persistence";
import { toast } from "sonner";

interface SpaceUpdateData {
  space: Location;
  binding: SpaceBinding | null;
}

/**
 * Hook for updating space information
 */
export function useUpdateSpace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ space, binding }: SpaceUpdateData) => {
      // Update the space first
      await persistence.updateSpace(space);
      
      // If there's a binding to update
      if (binding) {
        await persistence.updateBinding(binding);
      }
      
      return { space, binding };
    },
    
    onSuccess: () => {
      // Invalidate queries to reload data
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['spaces', 'bindings'] });
      toast.success("Informações atualizadas com sucesso");
    },
    
    onError: (error) => {
      console.error("Erro ao atualizar espaço:", error);
      toast.error("Erro ao atualizar as informações do espaço");
    }
  });
}
