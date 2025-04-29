
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DoorClosed } from "lucide-react";
import { meetingRooms } from "@/data/locations";
import { Location } from "@/types";

interface RoomsOverviewProps {
  getRoomIconByCapacity: (capacity: number) => string;
}

export function RoomsOverview({ getRoomIconByCapacity }: RoomsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {meetingRooms.map((room) => (
        <Card key={room.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {getRoomIconByCapacity(room.capacity) === "auditorium" ? (
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
  );
}
