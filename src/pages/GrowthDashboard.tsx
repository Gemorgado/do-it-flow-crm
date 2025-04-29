
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { trackGTMEvent } from "@/utils/trackingUtils";
import { subDays } from "date-fns";

// Import our newly created components
import { GrowthHeader } from "@/components/Growth/GrowthHeader";
import { MetricsSummary, MetricProps } from "@/components/Growth/MetricsSummary";
import { OverviewTabContent } from "@/components/Growth/OverviewTabContent";
import { CampaignsTabContent } from "@/components/Growth/CampaignsTabContent";
import { ChannelsTabContent } from "@/components/Growth/ChannelsTabContent";
import { transformChartData, transformPieData, getChannelData } from "@/components/Growth/chartUtils";

// Import mock data
import { 
  leadSourceData, 
  campaignPerformanceData, 
  marketingROIData, 
  trafficSourceData, 
  metaVsGoogleData,
  growthMetrics
} from "@/data/mockData";

export default function GrowthDashboard() {
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

  // Cast growthMetrics to match MetricProps type
  const typedMetrics: MetricProps[] = growthMetrics.map(metric => ({
    ...metric,
    badgeVariant: metric.badgeVariant as "outline" | "secondary" | "default" | "destructive",
    changeDirection: metric.changeDirection as "up" | "down" | "neutral"
  }));

  // Transform the data for our components
  // The key fix: pre-transform the data to match the expected format
  const formattedLeadSourceData = transformPieData(leadSourceData);
  const formattedTrafficData = transformPieData(trafficSourceData);

  return (
    <div className="animate-fade-in space-y-6">
      <GrowthHeader dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />

      {/* Métricas principais em cards */}
      <MetricsSummary metrics={typedMetrics} />

      <Tabs defaultValue="overview" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent 
            leadSourceData={formattedLeadSourceData}
            trafficSourceData={formattedTrafficData}
            campaignPerformanceData={campaignPerformanceData}
            marketingROIData={marketingROIData}
            transformChartData={transformChartData}
            transformPieData={transformPieData}
          />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignsTabContent 
            metaVsGoogleData={metaVsGoogleData}
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
