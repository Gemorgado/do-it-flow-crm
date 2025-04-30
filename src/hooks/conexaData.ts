
import { useMemo } from 'react';
import { useSnapshot } from '@/contexts/SnapshotProvider';

export function useCustomers() {
  const snap = useSnapshot();
  return snap?.customers ?? [];
}

export function useContracts() {
  const snap = useSnapshot();
  return snap?.contracts ?? [];
}

export function useServices() {
  const snap = useSnapshot();
  return snap?.services ?? [];
}

export function useRoomOccupations() {
  const snap = useSnapshot();
  return snap?.roomOccupations ?? [];
}

/** Ocupação diária por sala (exibida no Mapa) */
export function useTodayRoomOccupancy() {
  const rooms = useRoomOccupations();
  const today = new Date().toISOString().slice(0, 10);
  return useMemo(
    () => rooms.filter(r => r.date === today),
    [rooms, today]
  );
}
