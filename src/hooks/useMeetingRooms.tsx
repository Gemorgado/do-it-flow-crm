
import { useState, useMemo } from "react";
import { calculateDailyOccupancy, Reservation } from "@/components/Growth/meetingRoomOccupancy";

// Mock reservation data - in a real app, this would come from an API or database
const mockReservations: Reservation[] = [
  { roomId: "MIT1", date: '2025-04-29', type: 'daily' },
  { roomId: "MIT2", date: '2025-04-29', type: 'hourly', start: '14:00', end: '17:00' },
  { roomId: "MIT3", date: '2025-04-29', type: 'hourly', start: '09:00', end: '12:00' },
  { roomId: "MIT4", date: '2025-04-30', type: 'hourly', start: '13:00', end: '15:30' },
  { roomId: "MIT1", date: '2025-04-30', type: 'hourly', start: '09:00', end: '11:00' },
  { roomId: "MIT2", date: '2025-05-01', type: 'daily' },
];

export function useMeetingRooms() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Format date as YYYY-MM-DD
  const formattedDate = selectedDate ? 
    selectedDate.toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0];

  // Calculate occupancy for the selected date
  const occupancyData = useMemo(() => 
    calculateDailyOccupancy(formattedDate, mockReservations),
    [formattedDate]
  );

  // Helper function for room icons
  const getRoomIconByCapacity = (capacity: number) => {
    if (capacity > 20) return "auditorium";
    return "meeting-room";
  };

  // Calculate daily statistics for the sidebar
  const dailyStats = useMemo(() => {
    const roomsReserved = occupancyData.rooms.filter(room => room.reservedHours > 0).length;
    const totalRooms = occupancyData.rooms.length;
    const totalHoursReserved = occupancyData.rooms.reduce((sum, room) => sum + room.reservedHours, 0);
    
    return {
      roomsReserved,
      totalRooms,
      totalHoursReserved
    };
  }, [occupancyData]);

  return {
    selectedDate,
    setSelectedDate,
    activeTab,
    setActiveTab,
    formattedDate,
    occupancyData,
    getRoomIconByCapacity,
    mockReservations,
    dailyStats
  };
}
