
import React from "react";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { PieChart } from "@/components/ui/chart";
import { PieSlice } from "@/types/pie";

interface ChartSectionProps {
  cyclePieData: PieSlice[];
  delinquencyPieData: PieSlice[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ 
  cyclePieData, 
  delinquencyPieData 
}) => {
  // Empty chart config object (required by PieChart component)
  const chartConfig = {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Distribuição por Periodicidade">
        <div className="p-6 flex justify-center">
          <PieChart data={cyclePieData} config={chartConfig} />
        </div>
      </ChartCard>

      <ChartCard title="Adimplência">
        <div className="p-6 flex justify-center">
          <PieChart data={delinquencyPieData} config={chartConfig} />
        </div>
      </ChartCard>
    </div>
  );
};
