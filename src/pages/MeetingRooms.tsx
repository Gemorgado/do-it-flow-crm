
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeetingRooms } from "@/hooks/useMeetingRooms";
import { RoomsOverview } from "@/components/MeetingRooms/RoomsOverview";
import { ReservationsTable } from "@/components/MeetingRooms/ReservationsTable";
import { OccupancyStats } from "@/components/MeetingRooms/OccupancyStats";
import { CalendarSidebar } from "@/components/MeetingRooms/CalendarSidebar";

export default function MeetingRooms() {
  const {
    selectedDate,
    setSelectedDate,
    activeTab,
    setActiveTab,
    formattedDate,
    occupancyData,
    getRoomIconByCapacity,
    mockReservations,
    dailyStats
  } = useMeetingRooms();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salas de Reunião e Auditório</h1>
          <p className="text-gray-500">Gerenciamento e reservas de salas de reunião e auditório</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="reservations">Reservas</TabsTrigger>
              <TabsTrigger value="occupancy">Ocupação</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <RoomsOverview getRoomIconByCapacity={getRoomIconByCapacity} />
            </TabsContent>
            
            <TabsContent value="reservations" className="space-y-4">
              <ReservationsTable reservations={mockReservations} />
            </TabsContent>
            
            <TabsContent value="occupancy" className="space-y-4">
              <OccupancyStats occupancyData={occupancyData} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CalendarSidebar 
            selectedDate={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            formattedDate={formattedDate}
            dailyStats={dailyStats}
          />
        </div>
      </div>
    </div>
  );
}
