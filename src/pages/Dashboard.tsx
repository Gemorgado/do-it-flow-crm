
import { 
  dashboardStats, 
  leadsChartData, 
  conversionChartData, 
  revenueChartData, 
  leadSourceChartData,
  tasks,
  leads,
  leadsTimeData
} from "@/data/mockData";
import { Task, Lead } from "@/types";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { StatCardsSection } from "@/components/Dashboard/StatCardsSection";
import { LeadsTimeChart } from "@/components/Growth/LeadsTimeChart";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { FunnelSourceSection } from "@/components/Dashboard/FunnelSourceSection";
import { ClientRevenueCard } from "@/components/Dashboard/ClientRevenueCard";
import { ChartsSection } from "@/components/Dashboard/ChartsSection";
import { TasksLeadsSection } from "@/components/Dashboard/TasksLeadsSection";
import { AutomationsIntegrationsCard } from "@/components/Dashboard/AutomationsIntegrationsCard";
import { transformChartData, transformPieChartData } from "@/components/Dashboard/ChartDataUtils";

export default function Dashboard() {
  // Transform chart data for the components
  const transformedLeadsData = transformChartData(leadsChartData);
  const transformedConversionData = transformChartData(conversionChartData);
  const transformedRevenueData = transformChartData(revenueChartData);
  const transformedLeadSourceData = transformPieChartData(leadSourceChartData);

  // Define empty config object for charts (required by component props)
  const chartConfig = {};

  // Mock data for CRM metrics with properly typed changeDirection
  const crmMetrics = [
    { 
      label: "Leads novos (mês)", 
      value: "256", 
      tooltipText: "Total de leads novos no último mês",
      changeValue: "12%",
      changeDirection: "up" as const
    },
    { 
      label: "Taxa de conversão", 
      value: "23,5%", 
      tooltipText: "Percentual de leads que se tornaram clientes",
      changeValue: "3.2%",
      changeDirection: "up" as const
    },
    { 
      label: "Taxa de churn", 
      value: "3.8%", 
      tooltipText: "Percentual de cancelamentos no último mês",
      changeValue: "0.5%",
      changeDirection: "down" as const
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
      changeDirection: "up" as const
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

  // Mock data for client revenue with properly typed status
  const clientRevenueData = [
    { 
      name: "Empresa ABC Ltda", 
      company: "Agência de Marketing", 
      monthlyRevenue: 3500, 
      renewalDate: "2025-06-15",
      status: "ativo" as const
    },
    { 
      name: "Tech Solutions", 
      company: "Startup de Tecnologia", 
      monthlyRevenue: 2800, 
      renewalDate: "2025-05-22",
      status: "ativo" as const
    },
    { 
      name: "Consultor Independente", 
      company: "João Silva", 
      monthlyRevenue: 1200, 
      renewalDate: "2025-05-10",
      status: "risco" as const
    },
    { 
      name: "Creative Studios", 
      company: "Design & Produção", 
      monthlyRevenue: 2200, 
      renewalDate: "2025-07-05",
      status: "ativo" as const
    },
    { 
      name: "Instituto Educacional", 
      company: "Cursos Online", 
      monthlyRevenue: 4500, 
      renewalDate: "2025-05-28",
      status: "pendente" as const
    }
  ];

  // Convert tasks to the correct type with proper union types for priority and status
  const typedTasks = tasks.map(task => ({
    ...task,
    priority: task.priority as "alta" | "média" | "baixa",
    status: task.status as "pendente" | "em_progresso" | "concluída" | "cancelada"
  }));

  return (
    <div className="animate-fade-in">
      <DashboardHeader />
      
      <StatCardsSection stats={dashboardStats} />

      {/* Visualização de leads por tempo */}
      <div className="mt-6">
        <LeadsTimeChart 
          dailyData={leadsTimeData.daily}
          weeklyData={leadsTimeData.weekly}
          monthlyTotal={leadsTimeData.monthlyTotal}
        />
      </div>

      <div className="mt-6">
        <CRMMetricsCard
          title="Métricas Comerciais (CRM)"
          metrics={crmMetrics}
        />
      </div>

      <FunnelSourceSection 
        funnelData={funnelData}
        transformedLeadSourceData={transformedLeadSourceData}
        chartConfig={chartConfig}
      />

      <div className="mt-6">
        <ClientRevenueCard
          title="Receita por Cliente"
          clients={clientRevenueData}
          totalRevenue={14200}
          projectedRevenue={178000}
        />
      </div>

      <ChartsSection 
        transformedLeadsData={transformedLeadsData}
        transformedRevenueData={transformedRevenueData}
        transformedConversionData={transformedConversionData}
        transformedLeadSourceData={transformedLeadSourceData}
        chartConfig={chartConfig}
      />

      <TasksLeadsSection 
        tasks={typedTasks}
        leads={leads as Lead[]}
      />

      <div className="mt-6">
        <AutomationsIntegrationsCard />
      </div>
    </div>
  );
}
