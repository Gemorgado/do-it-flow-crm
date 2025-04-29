
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip, ChartTooltipContent } from "./chart-tooltip";
import { ChartLegend, ChartLegendContent } from "./chart-legend";
import type { ChartOptions } from "chart.js";
import { PieSlice } from "@/types/pie";

const PieChart = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ChartContainer>, "children"> & {
    data: PieSlice[];
    config?: any;
    options?: ChartOptions<"pie">;
  }
>(({ data, config = {}, ...props }, ref) => {
  return (
    <ChartContainer ref={ref} config={config} {...props}>
      <RechartsPrimitive.PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <RechartsPrimitive.Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
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
