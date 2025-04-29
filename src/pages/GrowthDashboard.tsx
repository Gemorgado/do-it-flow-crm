
import { useState } from "react";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { MarketingROICard } from "@/components/Growth/MarketingROICard";
import { CampaignComparisonCard } from "@/components/Growth/CampaignComparisonCard";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { 
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Filter,
  Search
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { trackGTMEvent, getUTMParameters } from "@/utils/trackingUtils";
import { Badge } from "@/components/ui/badge";
import { 
  leadSourceData, 
  campaignPerformanceData, 
  marketingROIData, 
  trafficSourceData, 
  metaVsGoogleData,
  growthMetrics
} from "@/data/mockData";

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

export default function GrowthDashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });

  // Transform chart data for the components
  const transformedLeadSourceData = transformPieChartData(leadSourceData);
  const transformedTrafficData = transformChartData(trafficSourceData);
  const transformedComparisonData = transformChartData(metaVsGoogleData);
  
  // Define empty config object for charts
  const chartConfig = {};

  // Track page view for analytics
  useState(() => {
    trackGTMEvent("page_view", {
      page_name: "growth_dashboard",
      date_range: `${dateRange.from?.toISOString().split('T')[0]} to ${dateRange.to?.toISOString().split('T')[0]}`
    });
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Mídia Paga e Growth</h1>
          <p className="text-gray-500">Acompanhe o desempenho de suas campanhas e o retorno sobre investimento</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker
            value={dateRange}
            onValueChange={setDateRange}
          />
          <Button size="icon" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {growthMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  {metric.change && (
                    <span className={`text-xs font-medium ${
                      metric.changeDirection === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {metric.changeDirection === "up" ? (
                        <ArrowUp className="inline h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3 mr-0.5" />
                      )}
                      {metric.change}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant={metric.badgeVariant || "outline"} className="mt-1">
                {metric.badgeText}
              </Badge>
            </div>
            {metric.description && (
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <ChartCard title="Origem dos Leads" description="Distribuição por canal de aquisição">
          <div className="p-4">
            <PieChart
              className="h-64"
              data={transformedLeadSourceData}
              config={chartConfig}
            />
          </div>
        </ChartCard>

        <ChartCard title="CPL por Campanha" description="Custo por lead em cada campanha">
          <div className="p-4">
            <BarChart
              className="h-64"
              data={transformChartData(campaignPerformanceData)}
              config={chartConfig}
            />
          </div>
        </ChartCard>
      </div>

      <div className="mb-6">
        <MarketingROICard 
          title="Retorno sobre Investimento (ROAS)" 
          roiData={marketingROIData}
        />
      </div>

      <div className="mb-6">
        <ChartCard title="Evolução do Tráfego e Leads" description="Desempenho ao longo do tempo">
          <div className="p-4">
            <LineChart
              className="h-72"
              data={transformedTrafficData}
              config={chartConfig}
            />
          </div>
        </ChartCard>
      </div>

      <div className="mb-6">
        <CampaignComparisonCard 
          title="Google Ads vs Meta Ads" 
          description="Comparação de desempenho entre plataformas"
          data={transformedComparisonData}
        />
      </div>

      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Integrações de Rastreamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
                    <Search className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium">Google Tag Manager</h4>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Conectado</Badge>
              </div>
              <p className="text-sm text-gray-600">ID: GTM-XXXXX</p>
              <p className="text-sm text-gray-600">Última sincronização: Hoje, 14:30</p>
            </div>

            <div className="border rounded-md p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
                    <Search className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium">Meta Pixel</h4>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Conectado</Badge>
              </div>
              <p className="text-sm text-gray-600">ID: PIXEL-ID-HERE</p>
              <p className="text-sm text-gray-600">Última sincronização: Hoje, 14:30</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 rounded-md">
            <h4 className="font-medium mb-2">Parâmetros UTM Detectados</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fonte:</p>
                <p className="font-medium">google</p>
              </div>
              <div>
                <p className="text-muted-foreground">Meio:</p>
                <p className="font-medium">cpc</p>
              </div>
              <div>
                <p className="text-muted-foreground">Campanha:</p>
                <p className="font-medium">spring_promo</p>
              </div>
              <div>
                <p className="text-muted-foreground">Termo:</p>
                <p className="font-medium">software crm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
