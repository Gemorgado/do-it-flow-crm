
import { DateRange } from "react-day-picker";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart } from "@/components/ui/chart";
import { FileBarChart } from "lucide-react";

interface OccupancyReportProps {
  dateRange: DateRange;
}

export function OccupancyReport({ dateRange }: OccupancyReportProps) {
  // Mock occupancy data
  const occupancyMetrics = [
    { label: "Total de Salas", value: "40", tooltipText: "Total de salas privativas disponíveis" },
    { label: "Salas Ocupadas", value: "32", tooltipText: "Número de salas com contratos ativos", changeValue: "80%", changeDirection: "up" },
    { label: "Salas Disponíveis", value: "8", tooltipText: "Número de salas sem contratos ativos" },
    { label: "Total de Estações", value: "60", tooltipText: "Total de estações de trabalho disponíveis" },
    { label: "Estações Ocupadas", value: "45", tooltipText: "Número de estações com contratos ativos", changeValue: "75%", changeDirection: "up" },
    { label: "Estações Disponíveis", value: "15", tooltipText: "Número de estações sem contratos ativos" },
  ];

  const occupancyOverTimeData = [
    { name: "Jan", "Salas": 70, "Estações": 60 },
    { name: "Fev", "Salas": 75, "Estações": 65 },
    { name: "Mar", "Salas": 78, "Estações": 68 },
    { name: "Abr", "Salas": 80, "Estações": 70 },
    { name: "Mai", "Salas": 82, "Estações": 72 },
    { name: "Jun", "Salas": 80, "Estações": 75 },
  ];

  // Sample occupancy data table
  const occupancyDetails = [
    { type: "Sala Privativa", total: 40, occupied: 32, available: 8, occupancyRate: "80%" },
    { type: "Estação Fixa", total: 30, occupied: 25, available: 5, occupancyRate: "83%" },
    { type: "Estação Flexível", total: 30, occupied: 20, available: 10, occupancyRate: "67%" },
    { type: "Sala de Reunião", total: 5, occupied: 0, available: 5, occupancyRate: "0%" },
    { type: "Auditório", total: 1, occupied: 0, available: 1, occupancyRate: "0%" },
  ];

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
        action={<FileBarChart className="h-4 w-4 text-muted-foreground" />}
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
