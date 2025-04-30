
import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { persistence } from '@/integrations/persistence';
import type { ConexaSnapshot } from '@/integrations/conexa/types';

const SnapshotCtx = createContext<ConexaSnapshot | null>(null);

export const SnapshotProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: snap } = useQuery({
    queryKey: ['conexa', 'snapshot'],
    queryFn: () => persistence.getLastSnapshot(),
    staleTime: Infinity,
  });
  
  console.log('Snapshot →', snap);
  
  return <SnapshotCtx.Provider value={snap || null}>{children}</SnapshotCtx.Provider>;
};

export const useSnapshot = () => useContext(SnapshotCtx);
