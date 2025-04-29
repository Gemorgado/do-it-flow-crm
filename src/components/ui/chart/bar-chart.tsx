
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip, ChartTooltipContent } from "./chart-tooltip";
import { ChartLegend, ChartLegendContent } from "./chart-legend";

const BarChart = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof ChartContainer>, "children"> & {
    data?: Array<Record<string, any>>;
  }
>(({ data = [], config = {}, ...props }, ref) => {
  return (
    <ChartContainer ref={ref} config={config} {...props}>
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.entries(data[0] || {})
          .filter(([key]) => key !== "name")
          .map(([key]) => (
            <RechartsPrimitive.Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key}, #8884d8)`}
            />
          ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
});
BarChart.displayName = "BarChart";

export { BarChart };
