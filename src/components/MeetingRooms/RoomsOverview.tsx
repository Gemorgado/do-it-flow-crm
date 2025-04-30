
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DoorClosed } from "lucide-react";
import { Location } from "@/types";
import { useMemo } from "react";
import { meetingRooms } from "@/data/locations/meetingRooms";

interface RoomsOverviewProps {
  getRoomIconByCapacity: (capacity: number) => string;
}

export function RoomsOverview({ getRoomIconByCapacity }: RoomsOverviewProps) {
  // Group meeting rooms by floor
  const roomsByFloor = useMemo(() => {
    // Use the imported meeting rooms data instead of require
    
    // Group rooms by floor based on identifier (first digit)
    return meetingRooms.reduce((acc: Record<string, Location[]>, room: Location) => {
      const floorNumber = room.identifier.charAt(0);
      if (!acc[floorNumber]) {
        acc[floorNumber] = [];
      }
      acc[floorNumber].push(room);
      return acc;
    }, {});
  }, []);

  // Get floor numbers sorted in ascending order
  const floorNumbers = useMemo(() => {
    return Object.keys(roomsByFloor).sort((a, b) => Number(a) - Number(b));
  }, [roomsByFloor]);

  return (
    <div className="space-y-8">
      {floorNumbers.map(floor => (
        <div key={floor} className="space-y-4">
          <h3 className="text-lg font-medium">{floor}º Andar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomsByFloor[floor].map((room) => (
              <Card key={room.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getRoomIconByCapacity(room.capacity || 0) === "auditorium" ? (
                        <Users className="h-5 w-5 text-doIt-primary" />
                      ) : (
                        <DoorClosed className="h-5 w-5 text-doIt-primary" />
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
        </div>
      ))}
    </div>
  );
}
