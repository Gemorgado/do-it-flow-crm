
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { MarketingROICard } from "@/components/Growth/MarketingROICard";
import { CampaignComparisonCard } from "@/components/Growth/CampaignComparisonCard";
import { 
  leadSourceData, 
  campaignPerformanceData, 
  marketingROIData, 
  trafficSourceData, 
  metaVsGoogleData,
  growthMetrics
} from "@/data/mockData";
import { trackGTMEvent, trackFBPixelEvent } from "@/utils/trackingUtils";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function GrowthDashboard() {
  // Initialize date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [activeTab, setActiveTab] = useState("overview");

  const handleDateRangeChange = (range: DateRange) => {
    if (range?.from) {
      setDateRange(range);
      
      // Track date range change
      trackGTMEvent("marketing_date_filter_change", {
        from_date: range.from ? format(range.from, "yyyy-MM-dd") : undefined,
        to_date: range.to ? format(range.to, "yyyy-MM-dd") : undefined,
        days_range: range.from && range.to 
          ? Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
          : undefined
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Track tab change
    trackGTMEvent("marketing_dashboard_tab_change", {
      tab: value
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Growth Dashboard</h1>
          <p className="text-gray-500">Monitore suas campanhas de marketing e analise o ROI</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangePicker
            value={dateRange}
            onValueChange={handleDateRangeChange}
            align="end"
          />
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as origens</SelectItem>
              <SelectItem value="google">Google Ads</SelectItem>
              <SelectItem value="meta">Meta Ads</SelectItem>
              <SelectItem value="organic">Orgânico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas principais em cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {growthMetrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <Badge variant={metric.badgeVariant as "outline" | "secondary" | "default" | "destructive"}>
                  {metric.badgeText}
                </Badge>
              </div>
              <CardDescription>{metric.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <div className={`flex items-center ${
                    metric.changeDirection === "up" 
                      ? "text-green-500" 
                      : metric.changeDirection === "down" 
                        ? "text-red-500" 
                        : "text-gray-500"
                  }`}>
                    {metric.changeDirection === "up" ? "↑" : "↓"} {metric.change}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Gráficos da visão geral */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fonte dos Leads</CardTitle>
                <CardDescription>Distribuição das origens de leads no período</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <PieChart 
                  className="h-80" 
                  data={transformPieData(leadSourceData)} 
                  config={{}}
                  dataKey="value"
                  nameKey="name"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tráfego e Conversões</CardTitle>
                <CardDescription>Visitas no site e conversões em leads</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <LineChart className="h-80" data={transformChartData(trafficSourceData)} config={{}} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>CPL vs CAC por Campanha</CardTitle>
              <CardDescription>Comparativo de custo por lead e custo por aquisição</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <BarChart className="h-80" data={transformChartData(campaignPerformanceData)} config={{}} />
            </CardContent>
          </Card>
          
          <MarketingROICard 
            title="ROI de Marketing por Canal"
            roiData={marketingROIData}
          />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignComparisonCard
            title="Google Ads vs Meta Ads"
            data={metaVsGoogleData}
            googleData={getChannelData("Google Ads")}
            metaData={getChannelData("Meta Ads")}
          />
          
          {/* Mais conteúdo da aba de campanhas */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Campanhas</CardTitle>
              <CardDescription>Métricas detalhadas de cada campanha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Campanha A - Google Search</div>
                    <Badge variant="secondary" className="font-normal">
                      Ativa
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Custo</div>
                      <div>R$ 5.250,00</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Leads</div>
                      <div>112</div>
                    </div>
                    <div>
                      <div className="text-gray-500">CPL</div>
                      <div>R$ 46,87</div>
                    </div>
                    <div>
                      <div className="text-gray-500">CAC</div>
                      <div>R$ 375,00</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Campanha B - Facebook Feed</div>
                    <Badge variant="secondary" className="font-normal">
                      Ativa
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Custo</div>
                      <div>R$ 4.800,00</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Leads</div>
                      <div>98</div>
                    </div>
                    <div>
                      <div className="text-gray-500">CPL</div>
                      <div>R$ 48,97</div>
                    </div>
                    <div>
                      <div className="text-gray-500">CAC</div>
                      <div>R$ 400,00</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          {/* Conteúdo da aba de canais */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Google Ads</CardTitle>
                <CardDescription>Métricas de campanhas do Google</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm">Investimento</div>
                    <div className="font-medium">R$ 12.500,00</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">Leads</div>
                    <div className="font-medium">275</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">CPL</div>
                    <div className="font-medium">R$ 45,45</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">Clientes</div>
                    <div className="font-medium">32</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">CAC</div>
                    <div className="font-medium">R$ 390,63</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">ROAS</div>
                    <div className="font-medium text-green-600">288%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Meta Ads</CardTitle>
                <CardDescription>Métricas de campanhas do Facebook e Instagram</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm">Investimento</div>
                    <div className="font-medium">R$ 9.800,00</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">Leads</div>
                    <div className="font-medium">210</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">CPL</div>
                    <div className="font-medium">R$ 46,67</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">Clientes</div>
                    <div className="font-medium">25</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">CAC</div>
                    <div className="font-medium">R$ 392,00</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">ROAS</div>
                    <div className="font-medium text-green-600">285%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for data transformation
function transformChartData(chartData: any) {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return [];
  }
  
  return chartData.labels.map((label: string, index: number) => {
    const dataPoint: Record<string, any> = { name: label };
    
    chartData.datasets.forEach((dataset: any) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });
}

function transformPieData(chartData: any): any[] {
  if (!chartData || !chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
    return [];
  }
  
  // Explicitly create and return an array of objects
  const result: any[] = [];
  
  for (let i = 0; i < chartData.labels.length; i++) {
    result.push({
      name: chartData.labels[i],
      value: chartData.datasets[0].data[i],
      color: Array.isArray(chartData.datasets[0].backgroundColor) 
        ? chartData.datasets[0].backgroundColor[i] 
        : chartData.datasets[0].backgroundColor
    });
  }
  
  return result;
}

function getChannelData(channelName: string) {
  // Return mock data for the specified channel
  const channelData = marketingROIData.find(channel => channel.channel === channelName);
  
  return channelData || {
    channel: channelName,
    spend: 0,
    revenue: 0,
    roi: 0,
    leads: 0,
    customers: 0,
    cpl: 0,
    cac: 0
  };
}
