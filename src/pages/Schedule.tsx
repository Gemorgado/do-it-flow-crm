
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, DoorClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingRoomCalendar } from "@/components/Schedule/MeetingRoomCalendar";
import { DailyBookingsChart } from "@/components/Schedule/DailyBookingsChart";
import { ReservationStats } from "@/components/Schedule/ReservationStats";

export default function Schedule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-gray-500">Gerencie reservas de salas de reunião e auditório</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <MeetingRoomCalendar />
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DailyBookingsChart />
            </div>
            <div>
              <ReservationStats />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
