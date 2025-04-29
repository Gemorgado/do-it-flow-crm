
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip, ChartTooltipContent } from "./chart-tooltip";
import { ChartLegend, ChartLegendContent } from "./chart-legend";
import type { ChartData, ChartOptions } from "chart.js";
import { transformToPieSliceArray } from "@/components/Growth/chartUtils";

const PieChart = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ChartContainer>, "children"> & {
    data: ChartData<"pie"> | { name: string; value: number; color: string }[];
    config?: any;
    options?: ChartOptions<"pie">;
  }
>(({ data, config = {}, ...props }, ref) => {
  // Transform data if it's in Chart.js format
  const transformedData = React.useMemo(() => {
    if (Array.isArray(data)) {
      return data; // Already in the right format
    } else {
      // Convert from ChartData to array format
      return transformToPieSliceArray(data);
    }
  }, [data]);
  
  return (
    <ChartContainer ref={ref} config={config} {...props}>
      <RechartsPrimitive.PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <RechartsPrimitive.Pie
          data={transformedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {transformedData.map((entry, index) => (
            <RechartsPrimitive.Cell 
              key={`cell-${index}`} 
              fill={entry.color || `var(--color-${entry.name}, #8884d8)`} 
            />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
});
PieChart.displayName = "PieChart";

export { PieChart };
