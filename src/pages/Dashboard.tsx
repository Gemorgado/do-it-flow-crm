
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { StatCard } from "@/components/Dashboard/StatCard";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { TaskList } from "@/components/Dashboard/TaskList";
import { LeadsList } from "@/components/Dashboard/LeadsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { ConversionFunnelCard } from "@/components/Dashboard/ConversionFunnelCard";
import { ClientRevenueCard } from "@/components/Dashboard/ClientRevenueCard";
import { 
  Users, 
  MessageSquare, 
  ArrowRight, 
  CalendarCheck, 
  FileText,
  Plus
} from "lucide-react";

import { 
  dashboardStats, 
  leadsChartData, 
  conversionChartData, 
  revenueChartData, 
  leadSourceChartData,
  tasks,
  leads
} from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { getUTMParameters } from "@/utils/trackingUtils";

// Helper function to transform ChartData to format expected by chart components
const transformChartData = (chartData) => {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return [];
  }
  
  return chartData.labels.map((label, index) => {
    const dataPoint = { name: label };
    
    chartData.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });
};

// Transform pie chart data specifically
const transformPieChartData = (chartData) => {
  if (!chartData || !chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
    return [];
  }
  
  return chartData.labels.map((label, index) => ({
    name: label,
    value: chartData.datasets[0].data[index],
    color: chartData.datasets[0].backgroundColor instanceof Array 
      ? chartData.datasets[0].backgroundColor[index] 
      : chartData.datasets[0].backgroundColor
  }));
};

export default function Dashboard() {
  // Transform chart data for the components
  const transformedLeadsData = transformChartData(leadsChartData);
  const transformedConversionData = transformChartData(conversionChartData);
  const transformedRevenueData = transformChartData(revenueChartData);
  const transformedLeadSourceData = transformPieChartData(leadSourceChartData);

  // Define empty config object for charts (required by component props)
  const chartConfig = {};

  // Mock data for CRM metrics
  const crmMetrics = [
    { 
      label: "Leads novos (mês)", 
      value: "256", 
      tooltipText: "Total de leads novos no último mês",
      changeValue: "12%",
      changeDirection: "up" 
    },
    { 
      label: "Taxa de conversão", 
      value: "23,5%", 
      tooltipText: "Percentual de leads que se tornaram clientes",
      changeValue: "3.2%",
      changeDirection: "up" 
    },
    { 
      label: "Taxa de churn", 
      value: "3.8%", 
      tooltipText: "Percentual de cancelamentos no último mês",
      changeValue: "0.5%",
      changeDirection: "down" 
    },
    { 
      label: "Tempo médio de conversão", 
      value: "14 dias", 
      tooltipText: "Média entre primeiro contato e fechamento" 
    },
    { 
      label: "LTV médio", 
      value: "R$ 24k", 
      tooltipText: "Valor médio de vida útil dos clientes",
      changeValue: "6.7%",
      changeDirection: "up" 
    },
    { 
      label: "Renovações próximas", 
      value: "8", 
      tooltipText: "Contratos com vencimento nos próximos 30 dias" 
    }
  ];

  // Mock data for funnel stages
  const funnelData = [
    { stage: "Novo lead", count: 256, conversionRate: 100, dropoffRate: 0 },
    { stage: "Qualificado", count: 172, conversionRate: 67, dropoffRate: 33 },
    { stage: "Apresentação", count: 115, conversionRate: 45, dropoffRate: 22 },
    { stage: "Proposta", count: 83, conversionRate: 32, dropoffRate: 13 },
    { stage: "Negociação", count: 67, conversionRate: 26, dropoffRate: 6 },
    { stage: "Fechado", count: 60, conversionRate: 23.5, dropoffRate: 2.5 }
  ];

  // Mock data for client revenue
  const clientRevenueData = [
    { 
      name: "Empresa ABC Ltda", 
      company: "Agência de Marketing", 
      monthlyRevenue: 3500, 
      renewalDate: "2025-06-15",
      status: "ativo" 
    },
    { 
      name: "Tech Solutions", 
      company: "Startup de Tecnologia", 
      monthlyRevenue: 2800, 
      renewalDate: "2025-05-22",
      status: "ativo" 
    },
    { 
      name: "Consultor Independente", 
      company: "João Silva", 
      monthlyRevenue: 1200, 
      renewalDate: "2025-05-10",
      status: "risco" 
    },
    { 
      name: "Creative Studios", 
      company: "Design & Produção", 
      monthlyRevenue: 2200, 
      renewalDate: "2025-07-05",
      status: "ativo" 
    },
    { 
      name: "Instituto Educacional", 
      company: "Cursos Online", 
      monthlyRevenue: 4500, 
      renewalDate: "2025-05-28",
      status: "pendente" 
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Acompanhe os principais indicadores do seu negócio</p>
        </div>
        <Button size="sm" className="bg-doIt-primary hover:bg-doIt-dark">
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Leads Novos"
          value={dashboardStats.newLeads}
          icon={<Users className="h-5 w-5" />}
          description="Últimos 30 dias"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${dashboardStats.leadsConversion}%`}
          icon={<ArrowRight className="h-5 w-5" />}
          description="Últimos 30 dias"
        />
        <StatCard
          title="Clientes Ativos"
          value={dashboardStats.activeClients}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Faturamento"
          value={`R$ ${(dashboardStats.revenueMTD / 1000).toFixed(1)}k`}
          icon={<FileText className="h-5 w-5" />}
          description="Mês atual"
        />
      </div>

      <div className="mt-6">
        <CRMMetricsCard
          title="Métricas Comerciais (CRM)"
          metrics={crmMetrics}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ConversionFunnelCard
          title="Funil de Conversão"
          funnelData={funnelData}
        />
        <ChartCard title="Origem dos Leads">
          <div className="p-4">
            <PieChart 
              className="h-64" 
              data={transformedLeadSourceData}
              config={chartConfig}
            />
          </div>
        </ChartCard>
      </div>

      <div className="mt-6">
        <ClientRevenueCard
          title="Receita por Cliente"
          clients={clientRevenueData}
          totalRevenue={14200}
          projectedRevenue={178000}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Leads vs. Tempo">
          <div className="p-4">
            <LineChart 
              className="h-64" 
              data={transformedLeadsData} 
              config={chartConfig}
            />
          </div>
        </ChartCard>
        <ChartCard title="Receita Mensal">
          <div className="p-4">
            <BarChart 
              className="h-64" 
              data={transformedRevenueData}
              config={chartConfig}
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tarefas Pendentes</h3>
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </div>
            <TaskList tasks={tasks.filter(task => task.status !== "concluída" && task.status !== "cancelada")} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Leads Recentes</h3>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
            <LeadsList leads={leads} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="automations" className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium mb-1">Automações e Integrações</h3>
            <p className="text-sm text-gray-500">Configure fluxos automáticos para otimizar seu processo de vendas</p>
            <TabsList className="mt-3">
              <TabsTrigger value="automations">Automações</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4">
            <TabsContent value="automations" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 bg-doIt-light">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Boas-vindas Lead</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Envio automático de mensagem de boas-vindas para novos leads.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">WhatsApp</Badge>
                    <Badge variant="outline">E-mail</Badge>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Follow-up Automático</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Lembretes de follow-up para leads sem resposta há mais de 3 dias.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Notificação</Badge>
                    <Badge variant="outline">WhatsApp</Badge>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Alerta de Renovação</h4>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Desativado</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Alertas para contratos próximos do vencimento (30 dias antes).</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">E-mail</Badge>
                    <Badge variant="outline">Tarefa</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Nova Automação
              </Button>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 bg-doIt-light">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium">WhatsApp Business</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-3">Conectado</Badge>
                  <p className="text-sm text-gray-600">Envie e receba mensagens diretamente pelo CRM.</p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium">Google Tag Manager</h4>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Pendente</Badge>
                  <p className="text-sm text-gray-600">Rastreie a origem dos leads e campanhas.</p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white">
                      <CalendarCheck className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium">Assinatura Digital</h4>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-3">Pendente</Badge>
                  <p className="text-sm text-gray-600">Integre com DocuSign para contratos digitais.</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Nova Integração
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
