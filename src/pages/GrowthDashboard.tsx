
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { trackGTMEvent } from "@/utils/trackingUtils";
import { subDays } from "date-fns";
import type { ChartData } from "chart.js";
import { PieSlice } from "@/types/pie";
import { useProtectedRoute } from "@/modules/settings/users/hooks/useProtectedRoute";
import { ResetAllData } from "@/components/ResetAllData";

// Import our newly created components
import { GrowthHeader } from "@/components/Growth/GrowthHeader";
import { MetricsSummary, MetricProps } from "@/components/Growth/MetricsSummary";
import { OverviewTabContent } from "@/components/Growth/OverviewTabContent";
import { CampaignsTabContent } from "@/components/Growth/CampaignsTabContent";
import { ChannelsTabContent } from "@/components/Growth/ChannelsTabContent";
import { LeadsTimeChart } from "@/components/Growth/LeadsTimeChart";
import { 
  transformChartData, 
  toPieSliceArray, 
  getChannelData,
  ChartDataFormat
} from "@/components/Growth/chartUtils";

// Import mock data
import { 
  leadSourceData, 
  campaignPerformanceData, 
  marketingROIData, 
  trafficSourceData, 
  metaVsGoogleData,
  growthMetrics,
  leadsTimeData
} from "@/data/mockData";

export default function GrowthDashboard() {
  // Protect this page - requires GROWTH permission
  useProtectedRoute("GROWTH");

  // Initialize date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [activeTab, setActiveTab] = useState("overview");

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Track tab change
    trackGTMEvent("marketing_dashboard_tab_change", {
      tab: value
    });
  };

  // Convert growthMetrics to match MetricProps type
  const typedMetrics: MetricProps[] = growthMetrics.map(metric => ({
    label: metric.title,
    value: metric.value,
    description: "Performance metric", // Adding required field
    badgeText: metric.change || "", // Adding required field
    badgeVariant: metric.badgeVariant as "outline" | "secondary" | "default" | "destructive",
    change: metric.change,
    changeDirection: metric.changeDirection as "up" | "down" | "neutral"
  }));

  // Type assertion for our chart data
  const typedLeadSourceData = leadSourceData as ChartDataFormat;
  const typedTrafficSourceData = trafficSourceData as ChartDataFormat;

  // Transform the data to PieSlice[] format for PieChart component
  const leadSourcePieSlices: PieSlice[] = toPieSliceArray(typedLeadSourceData);
  const trafficSourcePieSlices: PieSlice[] = toPieSliceArray(typedTrafficSourceData);

  // Transform metaVsGoogleData to the format expected by CampaignsTabContent
  const transformedMetaVsGoogleData = transformChartData(metaVsGoogleData);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <GrowthHeader dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
        <ResetAllData />
      </div>

      {/* Métricas principais em cards */}
      <MetricsSummary metrics={typedMetrics} />

      {/* Adicionando o novo componente de visualização de leads por tempo */}
      <LeadsTimeChart 
        dailyData={leadsTimeData.daily}
        weeklyData={leadsTimeData.weekly}
        monthlyTotal={leadsTimeData.monthlyTotal}
      />

      <Tabs defaultValue="overview" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent 
            leadSourceData={leadSourcePieSlices}
            trafficSourceData={trafficSourcePieSlices}
            campaignPerformanceData={campaignPerformanceData}
            marketingROIData={marketingROIData}
            transformChartData={transformChartData}
            transformPieData={toPieSliceArray}
          />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignsTabContent 
            metaVsGoogleData={transformedMetaVsGoogleData}
            googleData={getChannelData("Google Ads", marketingROIData)}
            metaData={getChannelData("Meta Ads", marketingROIData)}
          />
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          <ChannelsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
