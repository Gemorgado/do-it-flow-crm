
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface MetricProps {
  label: string;
  value: string;
  description: string;
  badgeText: string;
  badgeVariant: "outline" | "secondary" | "default" | "destructive";
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
}

interface MetricsSummaryProps {
  metrics: MetricProps[];
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <Badge variant={metric.badgeVariant}>
                {metric.badgeText}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change && (
                <div className={`flex items-center ${
                  metric.changeDirection === "up" 
                    ? "text-green-500" 
                    : metric.changeDirection === "down" 
                      ? "text-red-500" 
                      : "text-gray-500"
                }`}>
                  {metric.changeDirection === "up" ? "↑" : "↓"} {metric.change}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
