
import { DateRange } from "react-day-picker";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { FileChart } from "lucide-react";

interface ContractsReportProps {
  dateRange: DateRange;
}

export function ContractsReport({ dateRange }: ContractsReportProps) {
  // Mock contracts metrics
  const contractMetrics = [
    { label: "Contratos Ativos", value: "77", tooltipText: "Número total de contratos ativos" },
    { label: "A vencer em 30 dias", value: "12", tooltipText: "Contratos que vencem nos próximos 30 dias", changeValue: "15%", changeDirection: "down" },
    { label: "Renovados (últimos 30d)", value: "9", tooltipText: "Contratos renovados nos últimos 30 dias", changeValue: "3", changeDirection: "up" },
    { label: "Cancelamentos (30d)", value: "4", tooltipText: "Contratos cancelados nos últimos 30 dias", changeValue: "5%", changeDirection: "down" },
    { label: "Taxa de Renovação", value: "75%", tooltipText: "Porcentagem de contratos que são renovados", changeValue: "3%", changeDirection: "up" },
    { label: "Tempo Médio de Contrato", value: "14 meses", tooltipText: "Duração média dos contratos ativos" },
  ];

  // Status distribution data
  const contractStatusData = [
    { name: "Ativos", value: 77, color: "#22c55e" },
    { name: "A Vencer (30d)", value: 12, color: "#eab308" },
    { name: "Cancelados (30d)", value: 4, color: "#ef4444" },
  ];

  // Type distribution data 
  const contractTypeData = [
    { name: "Sala Privativa", value: 32, color: "#4f46e5" },
    { name: "Estação Fixa", value: 25, color: "#06b6d4" },
    { name: "Estação Flexível", value: 20, color: "#8b5cf6" },
    { name: "Endereço Fiscal", value: 15, color: "#f97316" },
  ];

  // Sample contracts expiring soon
  const contractsExpiringSoon = [
    { id: "CT-2345", client: "Acme Solutions", type: "Sala Privativa", location: "Sala 105", expires: "10/05/2025", status: "a vencer" },
    { id: "CT-2350", client: "DevTech Inc", type: "Sala Privativa", location: "Sala 112", expires: "15/05/2025", status: "a vencer" },
    { id: "CT-2355", client: "Marketing Pro", type: "Estação Fixa", location: "E-05", expires: "18/05/2025", status: "a vencer" },
    { id: "CT-2360", client: "Consulting Group", type: "Sala Privativa", location: "Sala 120", expires: "22/05/2025", status: "a vencer" },
    { id: "CT-2365", client: "Tech Solutions", type: "Estação Fixa", location: "E-12", expires: "25/05/2025", status: "a vencer" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics summary */}
      <CRMMetricsCard 
        title="Visão Geral de Contratos" 
        metrics={contractMetrics}
      />

      {/* Charts for contract distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Distribuição por Status" 
          description="Status dos contratos atuais"
          action={<FileChart className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="p-6 h-80">
            <PieChart 
              data={contractStatusData}
              dataKey="value"
              nameKey="name"
            />
          </div>
        </ChartCard>

        <ChartCard 
          title="Distribuição por Tipo de Serviço" 
          description="Contratos ativos por tipo de serviço"
          action={<FileChart className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="p-6 h-80">
            <PieChart 
              data={contractTypeData} 
              dataKey="value"
              nameKey="name"
            />
          </div>
        </ChartCard>
      </div>

      {/* Contracts expiring soon */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Contratos a Vencer (Próximos 30 Dias)</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractsExpiringSoon.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.id}</TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{contract.location}</TableCell>
                  <TableCell>{contract.expires}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      A vencer
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
