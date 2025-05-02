
import { parseISO, isBefore, isAfter, areIntervalsOverlapping } from 'date-fns';
import { Reservation } from '@/types/schedule';

export function isWithinBusinessHours(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  return start.getHours() >= 8 && end.getHours() <= 19 && isBefore(start, end);
}

export function isSlotFree(
  newRes: Reservation,
  existing: Reservation[]
): boolean {
  return !existing.some(r =>
    r.resource === newRes.resource &&
    areIntervalsOverlapping(
      { start: parseISO(newRes.start), end: parseISO(newRes.end) },
      { start: parseISO(r.start), end: parseISO(r.end) }
    )
  );
}

export function validateReservation(res: Reservation, all: Reservation[]) {
  if (!isWithinBusinessHours(res.start, res.end))
    throw new Error('Horário fora do expediente (08-19 h)');

  if (!isSlotFree(res, all))
    throw new Error('Conflito: já existe reserva nesse horário');
}
