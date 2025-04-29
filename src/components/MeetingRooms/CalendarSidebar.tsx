
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
  formattedDate: string;
  dailyStats: {
    roomsReserved: number;
    totalRooms: number;
    totalHoursReserved: number;
  };
}

export function CalendarSidebar({ 
  selectedDate, 
  onDateChange, 
  formattedDate,
  dailyStats
}: CalendarSidebarProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Detalhes do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Data</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Salas Reservadas</span>
              <span>
                {dailyStats.roomsReserved} de {dailyStats.totalRooms}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Horas Totais Reservadas</span>
              <span>
                {dailyStats.totalHoursReserved.toFixed(1)}h
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
