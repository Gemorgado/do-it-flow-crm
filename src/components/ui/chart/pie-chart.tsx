
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip, ChartTooltipContent } from "./chart-tooltip";
import { ChartLegend, ChartLegendContent } from "./chart-legend";
import { PieSlice } from "@/components/Growth/chartUtils";

const PieChart = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ChartContainer>, "children"> & {
    data?: PieSlice[];
    dataKey?: string;
    nameKey?: string;
  }
>(({ data = [], dataKey = "value", nameKey = "name", config = {}, ...props }, ref) => {
  // Ensure data is an array before trying to map it
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <ChartContainer ref={ref} config={config} {...props}>
      <RechartsPrimitive.PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <RechartsPrimitive.Pie
          data={safeData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {safeData.map((entry, index) => (
            <RechartsPrimitive.Cell 
              key={`cell-${index}`} 
              fill={entry.color || `var(--color-${entry[nameKey]}, #8884d8)`} 
            />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
});
PieChart.displayName = "PieChart";

export { PieChart };
