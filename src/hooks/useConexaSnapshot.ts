
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { persistence } from '@/integrations/persistence';
import { processConexaSnapshot } from '@/integrations/conexa/processConexaSnapshot';
import type { ConexaSnapshot } from '@/integrations/conexa/types';
import { toast } from '@/components/ui/sonner';

const SNAP_KEY = ['conexa', 'snapshot'];

export function useConexaSnapshot() {
  return useQuery({
    queryKey: SNAP_KEY,
    queryFn: () => persistence.getLastSnapshot(),
  });
}

export function useApplySnapshot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (snap: ConexaSnapshot) => processConexaSnapshot(snap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNAP_KEY });
      toast("📦 Dados do Conexa atualizados", {
        description: "Os dados foram sincronizados com sucesso."
      });
    },
  });
}
