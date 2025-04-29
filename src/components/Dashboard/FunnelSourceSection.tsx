
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { ConversionFunnelCard } from "@/components/Dashboard/ConversionFunnelCard";
import { PieChart } from "@/components/ui/chart";

interface FunnelSourceSectionProps {
  funnelData: any[];
  transformedLeadSourceData: any[];
  chartConfig: any;
}

export function FunnelSourceSection({ 
  funnelData, 
  transformedLeadSourceData, 
  chartConfig 
}: FunnelSourceSectionProps) {
  return (
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
  );
}
