
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip, ChartTooltipContent } from "./chart-tooltip";
import { ChartLegend, ChartLegendContent } from "./chart-legend";
import type { ChartData, ChartOptions } from "chart.js";

const PieChart = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ChartContainer>, "children"> & {
    data?: ChartData<"pie">;
    options?: ChartOptions<"pie">;
  }
>(({ data = { labels: [], datasets: [] }, config = {}, ...props }, ref) => {
  // Transform Chart.js data format to Recharts format
  const transformedData = React.useMemo(() => {
    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
      return [];
    }
    
    return data.labels.map((label, index) => ({
      name: label,
      value: data.datasets[0].data[index],
      color: Array.isArray(data.datasets[0].backgroundColor) 
        ? data.datasets[0].backgroundColor[index] 
        : data.datasets[0].backgroundColor
    }));
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
