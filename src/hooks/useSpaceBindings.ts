
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { persistence } from "@/integrations/persistence";
import type { SpaceBinding } from "@/types";
import { toast } from "sonner";

/**
 * Hook to get all space bindings
 * @returns Query with space bindings data
 */
export function useSpaceBindings() {
  return useQuery({
    queryKey: ["spaces", "bindings"],
    queryFn: async () => {
      return await persistence.listBindings();
    }
  });
}

/**
 * Hook to bind a space to a client and contract
 * @returns Mutation for binding a space
 */
export function useBindSpace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (binding: SpaceBinding) => {
      await persistence.bindSpace(binding);
      return binding;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces", "bindings"] });
      toast.success("Espaço vinculado com sucesso", {
        description: "O espaço foi atribuído ao cliente selecionado"
      });
      return null;
    },
    onError: (error: Error) => {
      toast.error("Erro ao vincular espaço", {
        description: error.message || "Não foi possível vincular o espaço ao cliente"
      });
      return null;
    }
  });
}

/**
 * Hook to unbind a space from client and contract
 * @returns Mutation for unbinding a space
 */
export function useUnbindSpace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (spaceId: string) => {
      await persistence.unbindSpace(spaceId);
      return spaceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces", "bindings"] });
      toast.success("Vínculo removido com sucesso", {
        description: "O espaço está agora disponível"
      });
      return null;
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover vínculo", {
        description: error.message || "Não foi possível remover o vínculo do espaço"
      });
      return null;
    }
  });
}
