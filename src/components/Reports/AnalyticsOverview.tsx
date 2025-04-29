
import { DateRange } from "react-day-picker";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/ui/chart";
import { FileChartColumn, TrendingUp } from "lucide-react";

interface AnalyticsOverviewProps {
  dateRange: DateRange;
}

export function AnalyticsOverview({ dateRange }: AnalyticsOverviewProps) {
  // Mock analytics metrics
  const analyticsMetrics = [
    { label: "Salas Disponíveis", value: "8", tooltipText: "Salas privativas disponíveis para locação" },
    { label: "Estações Disponíveis", value: "15", tooltipText: "Estações de trabalho disponíveis para locação" },
    { label: "Receita Projetada (Anual)", value: "R$ 1.74M", tooltipText: "Projeção de receita anual com contratos atuais", changeValue: "8%", changeDirection: "up" as const },
    { label: "Receita Potencial Máxima", value: "R$ 2.1M", tooltipText: "Receita máxima possível com 100% de ocupação" },
    { label: "Gap de Receita", value: "R$ 360K", tooltipText: "Diferença entre receita atual e potencial máxima" },
    { label: "Taxa de Retenção", value: "75%", tooltipText: "Porcentagem de clientes que renovam contratos", changeValue: "5%", changeDirection: "up" as const },
  ];

  // Client turnover data
  const turnoverData = [
    { name: "Jan", "Novos": 5, "Perdidos": 2 },
    { name: "Fev", "Novos": 7, "Perdidos": 3 },
    { name: "Mar", "Novos": 8, "Perdidos": 2 },
    { name: "Abr", "Novos": 6, "Perdidos": 4 },
    { name: "Mai", "Novos": 9, "Perdidos": 3 },
    { name: "Jun", "Novos": 7, "Perdidos": 2 },
  ];

  // Occupancy rate projection
  const occupancyProjectionData = [
    { name: "Jan", "Taxa": 70 },
    { name: "Fev", "Taxa": 75 },
    { name: "Mar", "Taxa": 78 },
    { name: "Abr", "Taxa": 80 },
    { name: "Mai", "Taxa": 82 },
    { name: "Jun", "Taxa": 80 },
    { name: "Jul", "Taxa": 83, "Projeção": 83 },
    { name: "Ago", "Projeção": 85 },
    { name: "Set", "Projeção": 86 },
    { name: "Out", "Projeção": 87 },
    { name: "Nov", "Projeção": 89 },
    { name: "Dez", "Projeção": 90 },
  ];

  const barChartConfig = {
    Novos: { color: "#22c55e" },
    Perdidos: { color: "#ef4444" },
  };

  const lineChartConfig = {
    Taxa: { color: "#4f46e5" },
    Projeção: { color: "#d1d5db", strokeDasharray: "5 5" },
  };

  return (
    <div className="space-y-6">
      {/* Analytics metrics summary */}
      <CRMMetricsCard 
        title="Visão Analítica" 
        metrics={analyticsMetrics}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client turnover chart */}
        <ChartCard 
          title="Turnover de Clientes" 
          description="Entrada e saída de clientes por mês"
          action={<FileChartColumn className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="p-6">
            <BarChart 
              data={turnoverData} 
              config={barChartConfig}
            />
          </div>
        </ChartCard>

        {/* Occupancy projection chart */}
        <ChartCard 
          title="Projeção de Taxa de Ocupação" 
          description="Taxa de ocupação atual e projetada (%)"
          action={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="p-6">
            <LineChart 
              data={occupancyProjectionData} 
              config={lineChartConfig}
            />
          </div>
        </ChartCard>
      </div>

      {/* Revenue optimization potential */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potencial de Otimização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-green-600">R$ 360K</span>
              <span className="text-sm text-gray-500">Receita anual adicional possível</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Custo de Aquisição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">R$ 2.800</span>
              <span className="text-sm text-gray-500">Custo médio para aquisição de cliente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">R$ 34.200</span>
              <span className="text-sm text-gray-500">Valor do ciclo de vida do cliente</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
