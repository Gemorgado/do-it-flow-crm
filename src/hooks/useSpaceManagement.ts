
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Location } from "@/types";
import { SpaceBinding } from "@/data/types"; // Use correct import
import { persistence } from "@/integrations/persistence";
import { toast } from "sonner";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface SpaceUpdateData {
  space: Location;
  binding: SpaceBinding | null;
}

/**
 * Hook para atualizar informações de espaço
 */
export function useUpdateSpace() {
  const queryClient = useQueryClient();
  
  // Carregar as localizações para verificar se o espaço existe antes de tentar atualizar
  useEffect(() => {
    // Pré-carrega as localizações para garantir que temos dados atualizados
    persistence.getLocations().catch(error => 
      console.error("Erro ao carregar localizações:", error)
    );
  }, []);
  
  return useMutation({
    mutationFn: async ({ space, binding }: SpaceUpdateData) => {
      console.log("Tentando atualizar espaço:", space);
      
      try {
        // Verificar se o espaço existe antes de atualizar
        const locations = await persistence.getLocations();
        const spaceExists = locations.some(loc => loc.id === space.id);
        
        if (!spaceExists) {
          throw new Error(`Espaço com ID ${space.id} não encontrado na lista de espaços`);
        }
        
        // Atualiza o espaço
        await persistence.updateSpace(space);
        
        // Se houver um binding para atualizar
        if (binding) {
          // Make sure binding has an id
          const bindingWithId = {
            ...binding,
            id: binding.id || uuidv4()
          };
          await persistence.updateBinding(bindingWithId);
        }
        
        return { space, binding };
      } catch (error) {
        console.error("Erro durante a atualização do espaço:", error);
        throw error;
      }
    },
    
    onSuccess: (data) => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['spaces', 'bindings'] });
      toast.success("Informações atualizadas com sucesso");
      console.log("Espaço atualizado com sucesso:", data.space);
    },
    
    onError: (error: Error) => {
      console.error("Erro ao atualizar espaço:", error);
      toast.error("Erro ao atualizar as informações do espaço", {
        description: error.message
      });
    }
  });
}
