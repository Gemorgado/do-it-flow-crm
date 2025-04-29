
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, PieChart, BarChart } from "@/components/ui/chart";
import { MarketingROICard } from "@/components/Growth/MarketingROICard";

interface OverviewTabContentProps {
  leadSourceData: any[];  // Changed type to array
  trafficSourceData: any[];  // Changed type to array
  campaignPerformanceData: any;
  marketingROIData: any;
  transformChartData: (data: any) => any[];
  transformPieData: (data: any) => any[];
}

export function OverviewTabContent({ 
  leadSourceData,
  trafficSourceData,
  campaignPerformanceData,
  marketingROIData,
  transformChartData,
  transformPieData
}: OverviewTabContentProps) {
  // The data is already transformed in GrowthDashboard, so we can use it directly
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fonte dos Leads</CardTitle>
            <CardDescription>Distribuição das origens de leads no período</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <PieChart 
              className="h-80" 
              data={leadSourceData}
              config={{}}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tráfego e Conversões</CardTitle>
            <CardDescription>Visitas no site e conversões em leads</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <LineChart 
              className="h-80" 
              data={transformChartData(trafficSourceData)} 
              config={{}} 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>CPL vs CAC por Campanha</CardTitle>
          <CardDescription>Comparativo de custo por lead e custo por aquisição</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <BarChart 
            className="h-80" 
            data={transformChartData(campaignPerformanceData)} 
            config={{}}
          />
        </CardContent>
      </Card>
      
      <MarketingROICard 
        title="ROI de Marketing por Canal"
        roiData={marketingROIData}
      />
    </div>
  );
}
