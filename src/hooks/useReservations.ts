
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReservations, saveReservations } from '@/data/reservationStore';
import { validateReservation } from '@/domain/scheduleRules';
import { v4 as uuidv4 } from 'uuid';
import { Reservation } from '@/types/schedule';

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: Omit<Reservation, 'id'>) => {
      const list = getReservations();
      const newRes = { ...payload, id: uuidv4() };
      validateReservation(newRes as Reservation, list);
      saveReservations([...list, newRes as Reservation]);
      return newRes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const list = getReservations();
      const filtered = list.filter(r => r.id !== id);
      saveReservations(filtered);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
