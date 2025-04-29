
/**
 * Meeting room occupancy calculation utilities
 * For Do It Coworking meeting rooms (MIT1-MIT4)
 */

/**
 * Reservation data model for meeting rooms
 */
export interface Reservation {
  roomId: 'MIT1' | 'MIT2' | 'MIT3' | 'MIT4';
  date: string;                       // yyyy-mm-dd
  start?: string;                     // 'HH:MM' (required if type === 'hourly')
  end?: string;                       // 'HH:MM' (required if type === 'hourly')
  type: 'hourly' | 'daily';
}

/**
 * Daily occupancy data structure
 */
export type DailyOccupancy = {
  date: string;                     // ISO-date (yyyy-mm-dd)
  rooms: {
    id: 'MIT1' | 'MIT2' | 'MIT3' | 'MIT4';
    reservedHours: number;          // ex.: 7.5
    occupancyRate: number;          // ex.: 0.68  (0-1)
  }[];
  overallOccupancyRate: number;     // average across all four rooms
};

// Constants
const ROOM_IDS = ['MIT1', 'MIT2', 'MIT3', 'MIT4'] as const;
const OPENING_HOUR = 8; // 8:00
const CLOSING_HOUR = 19; // 19:00
const AVAILABLE_HOURS_PER_DAY = CLOSING_HOUR - OPENING_HOUR; // 11 hours
const TOTAL_AVAILABLE_HOURS = AVAILABLE_HOURS_PER_DAY * ROOM_IDS.length;

/**
 * Converts time string in 'HH:MM' format to decimal hours
 * @param timeString - Time in 'HH:MM' format
 * @returns Hours as decimal number
 */
const timeStringToHours = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
};

/**
 * Calculates reserved hours for a single reservation
 * @param res - Reservation object
 * @returns Number of reserved hours
 */
export const calcReservedHours = (res: Reservation): number => {
  // For daily reservations, return the full day (11 hours)
  if (res.type === 'daily') {
    return AVAILABLE_HOURS_PER_DAY;
  }
  
  // For hourly reservations, calculate hours between start and end
  if (!res.start || !res.end) {
    console.warn(`Hourly reservation missing start/end times: ${JSON.stringify(res)}`);
    return 0;
  }
  
  let startHours = timeStringToHours(res.start);
  let endHours = timeStringToHours(res.end);
  
  // Validate and adjust times within opening hours (8:00 - 19:00)
  if (startHours < OPENING_HOUR) {
    console.warn(`Reservation start time ${res.start} is before opening hours (08:00). Adjusted to 08:00.`);
    startHours = OPENING_HOUR;
  }
  
  if (endHours > CLOSING_HOUR) {
    console.warn(`Reservation end time ${res.end} is after closing hours (19:00). Adjusted to 19:00.`);
    endHours = CLOSING_HOUR;
  }
  
  if (startHours >= endHours) {
    console.warn(`Invalid reservation: start time ${res.start} is after or equal to end time ${res.end}`);
    return 0;
  }
  
  return endHours - startHours;
};

/**
 * Creates an empty daily occupancy template with zero occupancy
 * @param date - Date string in 'YYYY-MM-DD' format
 * @returns Empty DailyOccupancy object
 */
export const getEmptyDailyTemplate = (date: string): DailyOccupancy => {
  return {
    date,
    rooms: ROOM_IDS.map(id => ({
      id,
      reservedHours: 0,
      occupancyRate: 0
    })),
    overallOccupancyRate: 0
  };
};

/**
 * Calculates daily occupancy for all meeting rooms based on reservations
 * @param date - Date string in 'YYYY-MM-DD' format
 * @param reservations - Array of reservations
 * @returns DailyOccupancy object with occupancy statistics
 */
export const calculateDailyOccupancy = (date: string, reservations: Reservation[]): DailyOccupancy => {
  // Start with empty template
  const result = getEmptyDailyTemplate(date);
  
  // If there are no reservations, return the empty template
  if (!reservations.length) {
    return result;
  }
  
  // Filter reservations for the specified date
  const dayReservations = reservations.filter(res => res.date === date);
  
  // Calculate reservedHours for each room
  result.rooms.forEach(room => {
    const roomReservations = dayReservations.filter(res => res.roomId === room.id);
    
    // Sum up reserved hours from all reservations for this room
    room.reservedHours = roomReservations.reduce((total, res) => {
      return total + calcReservedHours(res);
    }, 0);
    
    // Calculate occupancy rate for this room (reserved hours / available hours per day)
    room.occupancyRate = Math.min(1, room.reservedHours / AVAILABLE_HOURS_PER_DAY);
  });
  
  // Calculate overall occupancy rate (total reserved hours / total available hours)
  const totalReservedHours = result.rooms.reduce((sum, room) => sum + room.reservedHours, 0);
  result.overallOccupancyRate = totalReservedHours / TOTAL_AVAILABLE_HOURS;
  
  return result;
};
