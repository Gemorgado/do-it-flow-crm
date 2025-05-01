
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Location, SpaceBinding } from "@/types";
import { persistence } from "@/integrations/persistence";
import { toast } from "sonner";

interface SpaceUpdateData {
  space: Location;
  binding: SpaceBinding | null;
}

/**
 * Hook para atualizar informações de um espaço
 */
export function useUpdateSpace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ space, binding }: SpaceUpdateData) => {
      // Atualiza o espaço primeiro
      await persistence.updateSpace(space);
      
      // Se houver um binding para atualizar
      if (binding) {
        await persistence.updateBinding(binding);
      }
      
      return { space, binding };
    },
    
    onSuccess: () => {
      // Invalidate queries para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['spaces', 'bindings'] });
    },
    
    onError: (error) => {
      console.error("Erro ao atualizar espaço:", error);
      toast.error("Erro ao atualizar as informações do espaço");
    }
  });
}
