
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";

interface ChartsSectionProps {
  transformedLeadsData: any[];
  transformedRevenueData: any[];
  transformedConversionData: any[];
  transformedLeadSourceData: any[];
  chartConfig: any;
}

export function ChartsSection({ 
  transformedLeadsData, 
  transformedRevenueData,
  transformedLeadSourceData,
  chartConfig 
}: ChartsSectionProps) {
  return (
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
  );
}
