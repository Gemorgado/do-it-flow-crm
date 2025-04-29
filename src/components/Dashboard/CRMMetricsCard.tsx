
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface MetricItemProps {
  label: string;
  value: string | number;
  tooltipText?: string;
  changeValue?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
}

const MetricItem = ({ label, value, tooltipText, changeValue, changeDirection }: MetricItemProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        {tooltipText && (
          <Tooltip>
            <TooltipTrigger className="tooltip-trigger">
              <HelpCircle size={14} className="text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="top" className="tooltip-text bg-gray-800 text-white">
              {tooltipText}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-lg font-medium">{value}</span>
        {changeValue && changeDirection && (
          <span className={`text-xs ${
            changeDirection === 'up' ? 'text-green-600' : 
            changeDirection === 'down' ? 'text-red-600' : 
            'text-gray-500'
          }`}>
            {changeDirection === 'up' ? '↑ ' : 
             changeDirection === 'down' ? '↓ ' : ''}
            {changeValue}
          </span>
        )}
      </div>
    </div>
  );
};

interface CRMMetricsCardProps {
  title: string;
  metrics: MetricItemProps[];
  className?: string;
  action?: ReactNode;
}

export function CRMMetricsCard({ title, metrics, className, action }: CRMMetricsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <MetricItem key={index} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
