
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignComparisonTable } from "./CampaignComparisonTable";
import { defaultCampaignMetrics } from "./campaignMetricsData";

export interface CampaignComparisonCardProps {
  title: string;
  description?: string;
  data: any[];
  googleData?: any;
  metaData?: any;
  className?: string;
}

export function CampaignComparisonCard({ 
  title, 
  description, 
  data, 
  googleData,
  metaData,
  className 
}: CampaignComparisonCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  
  // Define empty config object for charts
  const chartConfig = {};
  
  // Use provided metrics or defaults
  const metrics = {
    google: googleData || defaultCampaignMetrics.google,
    meta: metaData || defaultCampaignMetrics.meta
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md font-medium">
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div>
          <TabsList className="grid grid-cols-2 h-8 w-32">
            <TabsTrigger value="chart" onClick={() => setView("chart")}>Gráfico</TabsTrigger>
            <TabsTrigger value="table" onClick={() => setView("table")}>Tabela</TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        {view === "chart" ? (
          <BarChart
            className="h-72"
            data={data}
            config={chartConfig}
          />
        ) : (
          <CampaignComparisonTable 
            googleMetrics={metrics.google} 
            metaMetrics={metrics.meta} 
          />
        )}
      </CardContent>
    </Card>
  );
}
