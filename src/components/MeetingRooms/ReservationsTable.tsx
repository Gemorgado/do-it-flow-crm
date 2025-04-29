
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { Reservation } from "@/components/Growth/meetingRoomOccupancy";

interface ReservationsTableProps {
  reservations: Reservation[];
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  return (
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
            {reservations.map((reservation, index) => (
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
  );
}
