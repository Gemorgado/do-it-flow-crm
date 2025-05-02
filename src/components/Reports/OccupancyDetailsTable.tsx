
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OccupancyDetails } from "@/hooks/useOccupancyReportData";

interface OccupancyDetailsTableProps {
  occupancyDetails: OccupancyDetails[];
}

export function OccupancyDetailsTable({ occupancyDetails }: OccupancyDetailsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Espaço</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Ocupados</TableHead>
            <TableHead className="text-right">Disponíveis</TableHead>
            <TableHead className="text-right">Taxa de Ocupação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {occupancyDetails.map((item) => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell className="text-right">{item.total}</TableCell>
              <TableCell className="text-right">{item.occupied}</TableCell>
              <TableCell className="text-right">{item.available}</TableCell>
              <TableCell className="text-right font-medium">{item.occupancyRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
