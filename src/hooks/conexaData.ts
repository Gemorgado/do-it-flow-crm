
import { useMemo } from 'react';
import { useSnapshot } from '@/contexts/SnapshotProvider';

export function useCustomers() {
  const snap = useSnapshot();
  if (!snap) {
    console.log("snapshot ainda null - useCustomers");
    return [];
  }
  return snap.customers ?? [];
}

export function useContracts() {
  const snap = useSnapshot();
  if (!snap) {
    console.log("snapshot ainda null - useContracts");
    return [];
  }
  return snap.contracts ?? [];
}

export function useServices() {
  const snap = useSnapshot();
  if (!snap) {
    console.log("snapshot ainda null - useServices");
    return [];
  }
  return snap.services ?? [];
}

export function useRoomOccupations() {
  const snap = useSnapshot();
  if (!snap) {
    console.log("snapshot ainda null - useRoomOccupations");
    return [];
  }
  return snap.roomOccupations ?? [];
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
