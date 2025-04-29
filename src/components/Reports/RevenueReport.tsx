
import { DateRange } from "react-day-picker";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { LineChart, PieChart } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileChartLine, FileChartPie } from "lucide-react";
import type { ChartData } from "chart.js";

interface RevenueReportProps {
  dateRange: DateRange;
}

export function RevenueReport({ dateRange }: RevenueReportProps) {
  // Mock revenue metrics
  const revenueMetrics = [
    { label: "Receita Mensal Atual", value: "R$ 145.800", tooltipText: "Receita recorrente mensal" },
    { label: "Receita Projetada (12m)", value: "R$ 1.74M", tooltipText: "Projeção anualizada", changeValue: "8%", changeDirection: "up" as const },
    { label: "Ticket Médio Mensal", value: "R$ 1.893", tooltipText: "Valor médio por contrato", changeValue: "3%", changeDirection: "up" as const },
    { label: "Sala Privativa", value: "R$ 96.000", tooltipText: "Receita mensal de salas privativas", changeValue: "66%", changeDirection: "neutral" as const },
    { label: "Estações", value: "R$ 37.500", tooltipText: "Receita mensal de estações", changeValue: "26%", changeDirection: "neutral" as const },
    { label: "Outros Serviços", value: "R$ 12.300", tooltipText: "Receita mensal de outros serviços", changeValue: "8%", changeDirection: "neutral" as const },
  ];

  // Revenue by service type as ChartData format
  const revenueByServiceData: ChartData<'pie'> = {
    labels: ["Salas Privativas", "Estações Fixas", "Estações Flexíveis", "Endereço Fiscal", "Salas de Reunião"],
    datasets: [
      {
        label: "Receita",
        data: [96000, 25000, 12500, 7500, 4800],
        backgroundColor: ["#4f46e5", "#06b6d4", "#8b5cf6", "#f97316", "#ec4899"]
      }
    ]
  };

  // Revenue over time
  const revenueOverTimeData = [
    { name: "Jan", "Receita": 125000 },
    { name: "Fev", "Receita": 130000 },
    { name: "Mar", "Receita": 135000 },
    { name: "Abr", "Receita": 140000 },
    { name: "Mai", "Receita": 145800 },
    { name: "Jun", "Receita": 150000, "Projeção": 150000 },
    { name: "Jul", "Projeção": 155000 },
    { name: "Ago", "Projeção": 160000 },
    { name: "Set", "Projeção": 165000 },
    { name: "Out", "Projeção": 170000 },
    { name: "Nov", "Projeção": 175000 },
    { name: "Dez", "Projeção": 180000 },
  ];

  // Revenue details by service type
  const revenueDetails = [
    { type: "Sala Privativa", contracts: 32, totalRevenue: "R$ 96.000", avgRevenue: "R$ 3.000", share: "66%" },
    { type: "Estação Fixa", contracts: 25, totalRevenue: "R$ 25.000", avgRevenue: "R$ 1.000", share: "17%" },
    { type: "Estação Flexível", contracts: 20, totalRevenue: "R$ 12.500", avgRevenue: "R$ 625", share: "9%" },
    { type: "Endereço Fiscal", contracts: 15, totalRevenue: "R$ 7.500", avgRevenue: "R$ 500", share: "5%" },
    { type: "Salas de Reunião", contracts: "-", totalRevenue: "R$ 4.800", avgRevenue: "-", share: "3%" },
  ];

  // Create config objects for the charts
  const lineChartConfig = {
    Receita: { color: "#4f46e5" },
    Projeção: { color: "#d1d5db", strokeDasharray: "5 5" },
  };
  
  const pieChartConfig = {
    "Salas Privativas": { color: "#4f46e5" },
    "Estações Fixas": { color: "#06b6d4" },
    "Estações Flexíveis": { color: "#8b5cf6" },
    "Endereço Fiscal": { color: "#f97316" },
    "Salas de Reunião": { color: "#ec4899" },
  };

  return (
    <div className="space-y-6">
      {/* Revenue metrics summary */}
      <CRMMetricsCard 
        title="Visão Geral de Receita" 
        metrics={revenueMetrics}
      />
      
      {/* Revenue evolution chart */}
      <ChartCard 
        title="Evolução de Receita Mensal" 
        description="Receita mensal atual e projetada para os próximos meses"
        action={<FileChartLine className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="p-6">
          <LineChart 
            data={revenueOverTimeData} 
            config={lineChartConfig}
          />
        </div>
      </ChartCard>

      {/* Revenue distribution chart */}
      <ChartCard 
        title="Distribuição de Receita por Tipo de Serviço" 
        description="Contribuição percentual de cada serviço na receita total"
        action={<FileChartPie className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="p-6 h-80">
          <PieChart 
            data={revenueByServiceData} 
            config={pieChartConfig}
          />
        </div>
      </ChartCard>
      
      {/* Revenue details table */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Detalhamento de Receita por Tipo de Serviço</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead className="text-right">Contratos</TableHead>
                <TableHead className="text-right">Receita Total</TableHead>
                <TableHead className="text-right">Receita Média</TableHead>
                <TableHead className="text-right">% da Receita</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueDetails.map((item) => (
                <TableRow key={item.type}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">{item.contracts}</TableCell>
                  <TableCell className="text-right">{item.totalRevenue}</TableCell>
                  <TableCell className="text-right">{item.avgRevenue}</TableCell>
                  <TableCell className="text-right font-medium">{item.share}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
