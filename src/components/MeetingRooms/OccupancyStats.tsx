
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RoomOccupancy {
  id: string;
  reservedHours: number;
  occupancyRate: number;
}

interface OccupancyStatsProps {
  occupancyData: {
    overallOccupancyRate: number;
    rooms: RoomOccupancy[];
  };
}

export function OccupancyStats({ occupancyData }: OccupancyStatsProps) {
  return (
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
  );
}
