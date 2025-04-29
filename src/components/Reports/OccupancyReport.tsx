
import { DateRange } from "react-day-picker";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart } from "@/components/ui/chart";
import { FileChartColumnIncreasing } from "lucide-react";
import { useEffect, useState } from "react";
import { 
  locations, 
  privateRooms, 
  workstations,
  meetingRooms
} from "@/data/locations";
import { Location } from "@/types";

interface OccupancyReportProps {
  dateRange: DateRange;
}

export function OccupancyReport({ dateRange }: OccupancyReportProps) {
  // Calculate real occupancy data based on the locations data
  const [occupancyData, setOccupancyData] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    roomOccupancyRate: 0,
    totalWorkstations: 0,
    occupiedWorkstations: 0,
    availableWorkstations: 0,
    workstationOccupancyRate: 0
  });

  useEffect(() => {
    // Calculate room statistics
    const totalRooms = privateRooms.length;
    const availableRooms = privateRooms.filter(room => room.available).length;
    const occupiedRooms = totalRooms - availableRooms;
    const roomOccupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

    // Calculate workstation statistics
    const totalWorkstations = workstations.length;
    const availableWorkstations = workstations.filter(station => station.available).length;
    const occupiedWorkstations = totalWorkstations - availableWorkstations;
    const workstationOccupancyRate = Math.round((occupiedWorkstations / totalWorkstations) * 100);
    
    setOccupancyData({
      totalRooms,
      occupiedRooms,
      availableRooms,
      roomOccupancyRate,
      totalWorkstations,
      occupiedWorkstations,
      availableWorkstations,
      workstationOccupancyRate
    });
  }, []);

  // Generate occupancy metrics from the calculated data
  const occupancyMetrics = [
    { label: "Total de Salas", value: occupancyData.totalRooms.toString(), tooltipText: "Total de salas privativas disponíveis" },
    { label: "Salas Ocupadas", value: occupancyData.occupiedRooms.toString(), tooltipText: "Número de salas com contratos ativos", changeValue: `${occupancyData.roomOccupancyRate}%`, changeDirection: "up" as const },
    { label: "Salas Disponíveis", value: occupancyData.availableRooms.toString(), tooltipText: "Número de salas sem contratos ativos" },
    { label: "Total de Estações", value: occupancyData.totalWorkstations.toString(), tooltipText: "Total de estações de trabalho disponíveis" },
    { label: "Estações Ocupadas", value: occupancyData.occupiedWorkstations.toString(), tooltipText: "Número de estações com contratos ativos", changeValue: `${occupancyData.workstationOccupancyRate}%`, changeDirection: "up" as const },
    { label: "Estações Disponíveis", value: occupancyData.availableWorkstations.toString(), tooltipText: "Número de estações sem contratos ativos" },
  ];

  // Calculate occupancy history (mock data based on current occupancy rates)
  const occupancyOverTimeData = [
    { name: "Jan", "Salas": Math.max(60, occupancyData.roomOccupancyRate - 20), "Estações": Math.max(50, occupancyData.workstationOccupancyRate - 20) },
    { name: "Fev", "Salas": Math.max(65, occupancyData.roomOccupancyRate - 15), "Estações": Math.max(55, occupancyData.workstationOccupancyRate - 15) },
    { name: "Mar", "Salas": Math.max(70, occupancyData.roomOccupancyRate - 10), "Estações": Math.max(60, occupancyData.workstationOccupancyRate - 10) },
    { name: "Abr", "Salas": Math.max(75, occupancyData.roomOccupancyRate - 5), "Estações": Math.max(65, occupancyData.workstationOccupancyRate - 5) },
    { name: "Mai", "Salas": occupancyData.roomOccupancyRate, "Estações": occupancyData.workstationOccupancyRate },
    { name: "Jun", "Salas": Math.min(100, occupancyData.roomOccupancyRate + 5), "Estações": Math.min(100, occupancyData.workstationOccupancyRate + 5) },
  ];

  // Generate detailed occupancy table data
  const generateOccupancyDetails = () => {
    // Get real counts for each type
    const privateRoomsTotal = privateRooms.length;
    const privateRoomsOccupied = privateRooms.filter(room => !room.available).length;
    const privateRoomsRate = Math.round((privateRoomsOccupied / privateRoomsTotal) * 100);
    
    const fixedStationsTotal = workstations.filter(ws => ws.identifier.includes("F")).length;
    const fixedStationsOccupied = workstations.filter(ws => ws.identifier.includes("F") && !ws.available).length;
    const fixedStationsRate = Math.round((fixedStationsOccupied / fixedStationsTotal) * 100);
    
    const flexStationsTotal = workstations.filter(ws => !ws.identifier.includes("F")).length;
    const flexStationsOccupied = workstations.filter(ws => !ws.identifier.includes("F") && !ws.available).length;
    const flexStationsRate = Math.round((flexStationsOccupied / flexStationsTotal) * 100);
    
    const meetingRoomsTotal = meetingRooms.length;
    const meetingRoomsOccupied = meetingRooms.filter(room => !room.available).length;
    const meetingRoomsRate = Math.round((meetingRoomsOccupied / meetingRoomsTotal) * 100);
    
    return [
      { type: "Sala Privativa", total: privateRoomsTotal, occupied: privateRoomsOccupied, available: privateRoomsTotal - privateRoomsOccupied, occupancyRate: `${privateRoomsRate}%` },
      { type: "Estação Fixa", total: fixedStationsTotal, occupied: fixedStationsOccupied, available: fixedStationsTotal - fixedStationsOccupied, occupancyRate: `${fixedStationsRate}%` },
      { type: "Estação Flexível", total: flexStationsTotal, occupied: flexStationsOccupied, available: flexStationsTotal - flexStationsOccupied, occupancyRate: `${flexStationsRate}%` },
      { type: "Sala de Reunião", total: meetingRoomsTotal, occupied: meetingRoomsOccupied, available: meetingRoomsTotal - meetingRoomsOccupied, occupancyRate: `${meetingRoomsRate}%` },
    ];
  };

  const occupancyDetails = generateOccupancyDetails();

  const barChartConfig = {
    Salas: { color: "#4f46e5" },
    Estações: { color: "#06b6d4" },
  };

  return (
    <div className="space-y-6">
      {/* Ocupação atual em números */}
      <CRMMetricsCard 
        title="Ocupação Atual" 
        metrics={occupancyMetrics}
      />

      {/* Gráfico de evolução da ocupação ao longo do tempo */}
      <ChartCard 
        title="Evolução da Taxa de Ocupação" 
        description="Porcentagem de ocupação ao longo dos últimos 6 meses"
        action={<FileChartColumnIncreasing className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="p-6">
          <BarChart 
            data={occupancyOverTimeData} 
            config={barChartConfig}
          />
        </div>
      </ChartCard>

      {/* Tabela detalhada de ocupação por tipo */}
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
    </div>
  );
}
