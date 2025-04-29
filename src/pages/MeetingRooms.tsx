
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  MeetingRoom, 
  Clipboard,
  Users
} from "lucide-react";
import { meetingRooms } from "@/data/locations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateDailyOccupancy } from "@/components/Growth/meetingRoomOccupancy";

// Mock reservation data - in a real app, this would come from an API or database
const mockReservations = [
  { roomId: 'MIT1', date: '2025-04-29', type: 'daily' },
  { roomId: 'MIT2', date: '2025-04-29', type: 'hourly', start: '14:00', end: '17:00' },
  { roomId: 'MIT3', date: '2025-04-29', type: 'hourly', start: '09:00', end: '12:00' },
  { roomId: 'MIT4', date: '2025-04-30', type: 'hourly', start: '13:00', end: '15:30' },
  { roomId: 'MIT1', date: '2025-04-30', type: 'hourly', start: '09:00', end: '11:00' },
  { roomId: 'MIT2', date: '2025-05-01', type: 'daily' },
];

export default function MeetingRooms() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Format date as YYYY-MM-DD
  const formattedDate = selectedDate ? 
    selectedDate.toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0];

  // Calculate occupancy for the selected date
  const occupancyData = calculateDailyOccupancy(formattedDate, mockReservations);

  const getRoomIconByCapacity = (capacity: number) => {
    if (capacity > 20) return "auditorium";
    return "meeting-room";
  };

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetingRooms.map((room) => (
                  <Card key={room.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getRoomIconByCapacity(room.capacity) === "auditorium" ? (
                            <Users className="h-5 w-5 text-doIt-primary" />
                          ) : (
                            <MeetingRoom className="h-5 w-5 text-doIt-primary" />
                          )}
                          {room.name}
                        </CardTitle>
                        <Badge variant={room.available ? "outline" : "secondary"}>
                          {room.available ? "Disponível" : "Ocupada"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Identificador</span>
                          <span>{room.identifier}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Capacidade</span>
                          <span>{room.capacity} pessoas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Área</span>
                          <span>{room.area} m²</span>
                        </div>
                        <div className="pt-2">
                          <Button size="sm" className="w-full">Reservar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reservations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reservas Atuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sala</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReservations.map((reservation, index) => (
                        <TableRow key={index}>
                          <TableCell>{reservation.roomId}</TableCell>
                          <TableCell>{reservation.date}</TableCell>
                          <TableCell>
                            {reservation.type === 'daily' ? 'Dia Inteiro' : 'Por Hora'}
                          </TableCell>
                          <TableCell>
                            {reservation.type === 'daily' 
                              ? '08:00 - 19:00' 
                              : `${reservation.start} - ${reservation.end}`}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Clipboard className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="occupancy" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Taxa de Ocupação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-doIt-primary">
                          {Math.round(occupancyData.overallOccupancyRate * 100)}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Taxa média de ocupação</div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sala</TableHead>
                            <TableHead>Horas Reservadas</TableHead>
                            <TableHead>Taxa de Ocupação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {occupancyData.rooms.map((room) => (
                            <TableRow key={room.id}>
                              <TableCell>{room.id}</TableCell>
                              <TableCell>{room.reservedHours.toFixed(1)}h</TableCell>
                              <TableCell>{Math.round(room.occupancyRate * 100)}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
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
                    {occupancyData.rooms.filter(room => room.reservedHours > 0).length} de 4
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Horas Totais Reservadas</span>
                  <span>
                    {occupancyData.rooms.reduce((sum, room) => sum + room.reservedHours, 0).toFixed(1)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
