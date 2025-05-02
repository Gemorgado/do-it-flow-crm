
import { Reservation } from '@/types/schedule';

export function getReservations(): Reservation[] {
  return JSON.parse(localStorage.getItem('reservations') ?? '[]');
}

export function saveReservations(list: Reservation[]) {
  localStorage.setItem('reservations', JSON.stringify(list));
}
